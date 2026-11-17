import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { GameItem } from "../types";

const STORAGE_KEY = "mediahub_games";

const validationSchema = Yup.object({
    title: Yup.string().trim().required("თამაშის სახელი აუცილებელია"),
    genre: Yup.string().trim().required("ჟანრის მითითება აუცილებელია"),
    imageUrl: Yup.string().url("მიუთითეთ სწორი URL ლინკი").required("ქავერის ლინკი აუცილებელია"),
});

export function Games() {
    const [games, setGames] = useState<GameItem[]>([]);
    const [mode, setMode] = useState<"view" | "add" | "delete">("view");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setGames(JSON.parse(saved));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const saveToLocalStorage = (items: GameItem[]) => {
        setGames(items);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const formik = useFormik({
        initialValues: { title: "", genre: "", imageUrl: "" },
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const newItem: GameItem = {
                id: Date.now(),
                title: values.title,
                genre: values.genre,
                imageUrl: values.imageUrl,
            };

            const updated = [...games, newItem];
            saveToLocalStorage(updated);
            resetForm();
            setMode("view");
        },
    });

    const handleDelete = (id: number) => {
        const updated = games.filter((g) => g.id !== id);
        saveToLocalStorage(updated);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">თამაშები</h2>

                {mode === "view" && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setMode("add")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                        >
                            ➕ დამატება (ლინკით)
                        </button>
                        <button
                            onClick={() => setMode("delete")}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                        >
                            🗑️ წაშლა
                        </button>
                    </div>
                )}

                {mode !== "view" && (
                    <button
                        onClick={() => setMode("view")}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                    >
                        გაუქმება / უკან
                    </button>
                )}
            </div>

            {mode === "add" && (
                <form
                    onSubmit={formik.handleSubmit}
                    className="bg-gray-900 border border-gray-800 p-5 rounded-xl mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-start"
                >
                    <div>
                        <input
                            type="text"
                            placeholder="თამაშის სახელი..."
                            {...formik.getFieldProps("title")}
                            className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="text-red-400 text-xs mt-1">{formik.errors.title}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="ჟანრი (მაგ: RPG, Horror)..."
                            {...formik.getFieldProps("genre")}
                            className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                        />
                        {formik.touched.genre && formik.errors.genre && (
                            <p className="text-red-400 text-xs mt-1">{formik.errors.genre}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="ქავერის ლინკი (URL)..."
                            {...formik.getFieldProps("imageUrl")}
                            className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                        />
                        {formik.touched.imageUrl && formik.errors.imageUrl && (
                            <p className="text-red-400 text-xs mt-1">{formik.errors.imageUrl}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer"
                    >
                        შენახვა
                    </button>
                </form>
            )}

            {games.length === 0 ? (
                <p className="text-gray-500 text-center py-12">თამაშები ჯერ არ არის დამატებული.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col"
                        >
                            <img src={game.imageUrl} alt={game.title} className="w-full h-60 object-cover" />
                            <div className="p-4 flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                                    <span className="inline-block w-fit bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
                                        {game.genre}
                                    </span>
                                </div>

                                {mode === "delete" && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleDelete(game.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                                        >
                                            წაშლა
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}