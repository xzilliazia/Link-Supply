<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'category' => ['sometimes', 'string', 'max:100'],
            'province' => ['sometimes', 'string', 'max:150'],
            'search' => ['sometimes', 'string', 'max:150'],
        ];
    }
}
