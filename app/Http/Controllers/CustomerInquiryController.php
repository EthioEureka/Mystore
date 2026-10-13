<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\InquiryStatusHistory;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shop;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerInquiryController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Screen 5: Inquiry Checkout (NO ONLINE PAYMENTS)
     */
    public function checkout(Request $request, string $shopSlug, string $productSlug): Response
    {
        $shop = Shop::where('slug', $shopSlug)
            ->where('status', 'approved')
            ->firstOrFail();

        $product = Product::where('shop_id', $shop->id)
            ->where('slug', $productSlug)
            ->where('status', 'published')
            ->with(['primaryImage', 'variants'])
            ->firstOrFail();

        $selectedVariantId = $request->input('variant_id');
        $selectedVariant = null;
        if ($selectedVariantId) {
            $selectedVariant = $product->variants()->where('id', $selectedVariantId)->first();
        }

        $user = $request->user();

        return Inertia::render('Customer/InquiryCheckout', [
            'shop' => $shop,
            'product' => $product,
            'selectedVariant' => $selectedVariant,
            'initialQuantity' => (int) $request->input('quantity', 1),
            'prefill' => [
                'name' => $user?->name ?? '',
                'phone' => $user?->phone ?? '',
                'telegram_username' => $user?->telegram_username ?? '',
            ],
        ]);
    }

    /**
     * Submit Purchase Inquiry (strictly off-platform workflow)
     */
    public function submit(Request $request, string $shopSlug, string $productSlug)
    {
        $shop = Shop::where('slug', $shopSlug)
            ->where('status', 'approved')
            ->firstOrFail();

        $product = Product::where('shop_id', $shop->id)
            ->where('slug', $productSlug)
            ->where('status', 'published')
            ->with(['primaryImage', 'variants'])
            ->firstOrFail();

        $validated = $request->validate([
            'customer_name' => 'required|string|max:150',
            'customer_phone' => 'required|string|max:40',
            'customer_telegram_username' => 'nullable|string|max:100',
            'quantity' => 'required|integer|min:1|max:100',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'customer_note' => 'nullable|string|max:500',
            'preferred_contact_method' => 'required|in:telegram,phone,either',
            'acknowledges_offline_sale' => 'accepted', // Must confirm off-platform payment & delivery
        ]);

        $variant = null;
        $variantDescription = null;
        $unitPrice = $product->effective_price;

        if (!empty($validated['product_variant_id'])) {
            $variant = ProductVariant::where('product_id', $product->id)
                ->where('id', $validated['product_variant_id'])
                ->firstOrFail();
            $variantDescription = $variant->name;
            if ($variant->price !== null) {
                $unitPrice = $variant->price;
            }
        }

        $quantity = (int) $validated['quantity'];
        $subtotal = $unitPrice ? ($unitPrice * $quantity) : null;

        // Snapshot immutable data
        $inquiry = Inquiry::create([
            'reference_number' => Inquiry::generateReference(),
            'shop_id' => $shop->id,
            'user_id' => $request->user()?->id,
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_telegram_username' => $validated['customer_telegram_username'] ? ltrim($validated['customer_telegram_username'], '@') : null,
            'customer_telegram_id' => $request->user()?->telegram_user_id,
            'preferred_contact_method' => $validated['preferred_contact_method'],
            'customer_note' => $validated['customer_note'] ?? null,
            'product_name_snapshot' => $product->name,
            'variant_description_snapshot' => $variantDescription,
            'product_image_snapshot' => $product->primaryImage?->image_path,
            'quantity' => $quantity,
            'unit_price_snapshot' => $unitPrice,
            'subtotal_snapshot' => $subtotal,
            'currency_snapshot' => $product->currency,
            'status' => 'sent',
        ]);

        // Status history initial record
        InquiryStatusHistory::create([
            'inquiry_id' => $inquiry->id,
            'user_id' => $request->user()?->id,
            'from_status' => 'none',
            'to_status' => 'sent',
            'comment' => 'Inquiry submitted by customer',
        ]);

        // Notify shop manager
        $this->notificationService->notifyNewInquiry($inquiry);

        return redirect()->route('customer.inquiry.confirmation', $inquiry->reference_number);
    }

    /**
     * Screen 6: Inquiry Confirmation
     */
    public function confirmation(string $referenceNumber): Response
    {
        $inquiry = Inquiry::where('reference_number', $referenceNumber)
            ->with(['shop'])
            ->firstOrFail();

        return Inertia::render('Customer/InquiryConfirmation', [
            'inquiry' => $inquiry,
            'shop' => $inquiry->shop,
        ]);
    }

    /**
     * Screen 7: My Inquiries
     */
    public function myInquiries(Request $request): Response
    {
        $user = $request->user();

        // If user logged in, get their inquiries; otherwise allow lookup by phone or session if needed
        $inquiries = Inquiry::where(function ($q) use ($user, $request) {
                if ($user) {
                    $q->where('user_id', $user->id);
                    if ($user->phone) {
                        $q->orWhere('customer_phone', $user->phone);
                    }
                } else {
                    // Return empty list if guest, or filtered by query phone
                    $phone = $request->input('phone');
                    if ($phone) {
                        $q->where('customer_phone', $phone);
                    } else {
                        $q->whereRaw('1=0');
                    }
                }
            })
            ->with(['shop:id,name,slug,logo,public_phone,public_telegram_username'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/MyInquiries', [
            'inquiries' => $inquiries,
        ]);
    }

    /**
     * Cancel Inquiry (customer action)
     */
    public function cancel(Request $request, string $referenceNumber)
    {
        $inquiry = Inquiry::where('reference_number', $referenceNumber)->firstOrFail();

        // Check ownership if user is logged in
        if ($request->user() && $inquiry->user_id && $inquiry->user_id !== $request->user()->id) {
            abort(403);
        }

        if (in_array($inquiry->status, ['closed', 'cancelled'])) {
            return back()->with('error', 'This inquiry is already resolved or cancelled.');
        }

        $oldStatus = $inquiry->status;
        $inquiry->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        InquiryStatusHistory::create([
            'inquiry_id' => $inquiry->id,
            'user_id' => $request->user()?->id,
            'from_status' => $oldStatus,
            'to_status' => 'cancelled',
            'comment' => 'Cancelled by customer',
        ]);

        return back()->with('success', 'Inquiry cancelled successfully.');
    }
}
