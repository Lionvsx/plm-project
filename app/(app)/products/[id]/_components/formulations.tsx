"use client";

import { Formulation } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface FormulationsListProps {
    productId: number;
    formulations: Formulation[];
}

export function FormulationsList({ productId, formulations }: FormulationsListProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Formulations</h2>
                <Button asChild>
                    <Link href={`/products/${productId}/formulations/new`}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Formulation
                    </Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {formulations.map((formulation) => (
                        <TableRow key={formulation.id}>
                            <TableCell>{formulation.name}</TableCell>
                            <TableCell>v{formulation.version}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={formulation.isActive ? "success" : "secondary"}
                                >
                                    {formulation.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatDate(formulation.updatedAt)}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/products/${productId}/formulations/${formulation.id}`}>
                                            View
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/products/${productId}/formulations/${formulation.id}/edit`}>
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {formulations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No formulations found. Create one to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
