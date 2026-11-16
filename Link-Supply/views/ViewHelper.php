<?php

final class ViewHelper
{
    public static function escape(string|int|float $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public static function formatIDR(int $value): string
    {
        return 'Rp ' . number_format($value, 0, ',', '.');
    }
}
