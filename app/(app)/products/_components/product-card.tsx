"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteVariantButton } from "./delete-variant-button";

interface ProductCardProps {
  variant: {
    id: number;
    size: string | null;
    sku: string | null;
    price: string | null;
  };
  productId: number;
}

export function ProductCard({ variant, productId }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{variant.size}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">SKU: {variant.sku}</span>
          <span className="font-medium">${Number(variant.price).toFixed(2)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              asChild
            >
              <Link href={`/products/${productId}/variants/${variant.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <DeleteVariantButton
              variantId={variant.id}
              productId={productId}
              size="icon"
            >
              <Trash2 className="h-4 w-4" />
            </DeleteVariantButton>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/products/${productId}/variants/${variant.id}`}>
              Show <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
