import { IngredientForm } from "../_components/form";

export default function NewIngredientPage() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">New Ingredient</h1>
                <p className="text-muted-foreground mt-2">
                    Add a new ingredient to the system.
                </p>
            </div>

            <div className="max-w-2xl">
                <IngredientForm />
            </div>
        </div>
    );
}
