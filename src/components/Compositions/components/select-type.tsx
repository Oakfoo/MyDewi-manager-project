import { CategoryProduct, Matter } from "../../../types";

interface TypeSelectorProps {
    categories: CategoryProduct[];
    matters: Matter[];
    selectedCategoryId: string;
    selectedMatterId: string;
    onChange: (categoryId: string, matterId: string) => void;
}

export function TypeSelector({
    categories,
    matters,
    selectedCategoryId,
    selectedMatterId,
    onChange,
}: TypeSelectorProps) {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center justify-even gap-[1rem]">
                <label htmlFor="comp-categories">Catégorie : </label>
                <select
                    id="comp-categories"
                    value={selectedCategoryId}
                    onChange={(ev) => onChange(ev.target.value, selectedMatterId)}
                    className="border-black border-b border-r-2 rounded-md"
                >
                    <option value="">Choisir...</option>
                    {categories.map((cat) => (
                        <option
                            key={cat.id}
                            value={cat.id}
                            className={`${cat.isActive ? "" : "hidden"} text-nowrap border-b-2 transition-all duration-300 ${
                                cat.id === selectedCategoryId ? "border-pink-400" : "border-transparent"
                            }`}
                        >
                            {cat.name.fr}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-even gap-[1rem]">
                <label htmlFor="comp-matters">Matière : </label>
                <select
                    id="comp-matters"
                    value={selectedMatterId}
                    onChange={(ev) => onChange(selectedCategoryId, ev.target.value)}
                    className="border-black border-b border-r-2 rounded-md"
                >
                    <option value="">Choisir...</option>
                    {matters.map((mat) => (
                        <option
                            key={mat.id}
                            value={mat.id}
                            className={`${mat.isActive ? "" : "hidden"} text-nowrap border-b-2 transition-all duration-300 ${
                                mat.id === selectedMatterId ? "border-pink-400" : "border-transparent"
                            }`}
                        >
                            {mat.name.fr}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
