<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Cart items
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],

            // Shipping address
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:30'],
            'shipping_street' => ['required', 'string', 'max:500'],
            'shipping_city' => ['required', 'string', 'max:255'],
            'shipping_province' => ['required', 'string', 'max:255'],
            'shipping_postal_code' => ['nullable', 'string', 'max:10'],

            // Payment
            'payment_method' => ['required', 'string', 'in:gopay,shopeepay,indomaret,transfer_bca,transfer_mandiri,transfer_bri,dana,ovo,cod'],

            // Optional
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'items.required' => 'Keranjang belanja tidak boleh kosong.',
            'items.min' => 'Keranjang belanja harus memiliki minimal 1 item.',
            'items.*.product_id.required' => 'Setiap item harus memiliki ID produk.',
            'items.*.product_id.exists' => 'Produk dengan ID :input tidak ditemukan.',
            'items.*.quantity.required' => 'Jumlah item harus diisi.',
            'items.*.quantity.min' => 'Jumlah item minimal 1.',
            'recipient_name.required' => 'Nama penerima wajib diisi.',
            'recipient_phone.required' => 'Nomor telepon penerima wajib diisi.',
            'shipping_street.required' => 'Alamat jalan wajib diisi.',
            'shipping_city.required' => 'Kota wajib diisi.',
            'shipping_province.required' => 'Provinsi wajib diisi.',
            'payment_method.required' => 'Metode pembayaran harus dipilih.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
        ];
    }
}
