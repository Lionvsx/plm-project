"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Document, Page, Text, View, StyleSheet, BlobProvider } from "@react-pdf/renderer";
import { formatQuantity } from "@/lib/constants/units";
import { Unit } from "@/lib/constants/units";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  table: {
    width: '100%',
    marginTop: 30,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  tableHeader: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tableCellNarrow: {
    flex: 0.8,
    paddingHorizontal: 8,
  },
  tableCellWide: {
    flex: 1.4,
    paddingHorizontal: 8,
  },
  headerText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
    color: '#111827',
  },
  total: {
    marginTop: 30,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalText: {
    fontSize: 12,
    color: '#111827',
    textAlign: 'right',
    fontWeight: 'bold',
  },
});

interface BOMDocumentProps {
  productName: string;
  variantSku: string;
  formulationName: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: Unit;
    costPerUnit: string;
  }[];
}

function BOMDocument({ productName, variantSku, formulationName, ingredients }: BOMDocumentProps) {
  const totalCost = ingredients.reduce((sum, ingredient) => {
    return sum + (parseFloat(ingredient.quantity) * parseFloat(ingredient.costPerUnit));
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Bill of Materials</Text>
          <Text style={styles.subtitle}>Product: {productName}</Text>
          <Text style={styles.subtitle}>Variant: {variantSku}</Text>
          <Text style={styles.subtitle}>Formulation: {formulationName}</Text>
          <Text style={styles.subtitle}>Generated: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCellWide}>
              <Text style={styles.headerText}>INGREDIENT</Text>
            </View>
            <View style={styles.tableCellNarrow}>
              <Text style={styles.headerText}>QUANTITY</Text>
            </View>
            <View style={styles.tableCellNarrow}>
              <Text style={styles.headerText}>COST/UNIT</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>TOTAL COST</Text>
            </View>
          </View>

          {ingredients.map((ingredient, index) => {
            const totalIngredientCost = parseFloat(ingredient.quantity) * parseFloat(ingredient.costPerUnit);
            return (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCellWide}>
                  <Text style={styles.text}>{ingredient.name}</Text>
                </View>
                <View style={styles.tableCellNarrow}>
                  <Text style={styles.text}>{formatQuantity(parseFloat(ingredient.quantity), ingredient.unit)}</Text>
                </View>
                <View style={styles.tableCellNarrow}>
                  <Text style={styles.text}>${parseFloat(ingredient.costPerUnit).toFixed(2)} / {ingredient.unit}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.text}>${totalIngredientCost.toFixed(2)}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.total}>
          <Text style={styles.totalText}>Total Cost: ${totalCost.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}

interface BOMGeneratorProps {
  productName: string;
  variantSku: string;
  formulationName: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: Unit;
    costPerUnit: string;
  }[];
}

export function BOMGenerator({ productName, variantSku, formulationName, ingredients }: BOMGeneratorProps) {
  return (
    <BlobProvider
      document={
        <BOMDocument
          productName={productName}
          variantSku={variantSku}
          formulationName={formulationName}
          ingredients={ingredients}
        />
      }
    >
      {({ blob, url, loading, error }) => {
        if (error) {
          return <Button size="sm" disabled>Error generating PDF</Button>;
        }

        if (loading || !url) {
          return (
            <Button size="sm" disabled>
              <FileDown className="w-4 h-4 mr-2" />
              Generating...
            </Button>
          );
        }

        return (
          <Button asChild variant="secondary">
            <a href={url} download={`BOM-${variantSku}-${new Date().toISOString().split('T')[0]}.pdf`}>
              <FileDown className="w-4 h-4 mr-2" />
              Generate BOM
            </a>
          </Button>
        );
      }}
    </BlobProvider>
  );
}
