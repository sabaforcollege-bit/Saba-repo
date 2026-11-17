import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { PhotoItem } from "../types";

// ვამატებთ ფოლდერის ტიპს
interface Folder {
    id: number;
    name: string;
}

const STORAGE_KEY = "mediahub_photos";
const FOLDERS_KEY = "mediahub_folders";

const validationSchema = Yup.object({
    title: Yup.string().trim().required("დასათაურება აუცილებელია"),
    imageUrl: Yup.string().url("მიუთითეთ სწორი URL ლინკი").required("ლინკის მითითება აუცილებელია"),
    folderId: Yup.string().required("აირჩიეთ ფოლდერი"),
});

export function Photos() {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null); // რომელი ფოლდერია გახსნილი
    const [newFolderName, setNewFolderName] = useState(""); // ახალი ფოლდერის სახელი

    const [mode, setMode] = useState<"view" | "add" | "delete" | "addFolder">("view");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // მონაცემების ჩატვირთვა localStorage-დან
    useEffect(() => {
        const savedPhotos = localStorage.getItem(STORAGE_KEY);
        if (savedPhotos) {
            try {
                setPhotos(JSON.parse(savedPhotos));
            } catch (e) {
                console.error(e);
            }
        }

        const savedFolders = localStorage.getItem(FOLDERS_KEY);
        if (savedFolders) {
            try {
                setFolders(JSON.parse(savedFolders));
            } catch (e) {
                console.error(e);
            }
        } else {
            // საწყისი ფოლდერი თუ არაფერია
            const defaultFolders = [{ id: 1, name: "ზოგადი ფოტოები" }];
            setFolders(defaultFolders);
            localStorage.setItem(FOLDERS_KEY, JSON.stringify(defaultFolders));
        }
    }, []);

    const savePhotosToStorage = (items: PhotoItem[]) => {
        setPhotos(items);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const saveFoldersToStorage = (items: Folder[]) => {
        setFolders(items);
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(items));
    };

    // ახალი ფოლდერის შექმნა
    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const newFolder: Folder = {
            id: Date.now(),
            name: newFolderName.trim(),
        };

        const updatedFolders = [...folders, newFolder];
        saveFoldersToStorage(updatedFolders);
        setNewFolderName("");
        setMode("view");
    };

    const formik = useFormik({
        initialValues: { title: "", imageUrl: "", folderId: selectedFolderId ? String(selectedFolderId) : "" },
        enableReinitialize: true,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const newPhoto: PhotoItem & { folderId?: number } = {
                id: Date.now(),
                title: values.title,
                imageUrl: values.imageUrl,
                folderId: Number(values.folderId),
            };

            const updated = [...photos, newPhoto];
            savePhotosToStorage(updated);
            resetForm();
            setMode("view");
        },
    });

    const handleDelete = (id: number) => {
        const updated = photos.filter((p) => p.id !== id);
        savePhotosToStorage(updated);
    };

    // მიმდინარე ფოლდერში არსებული ფოტოები
    const filteredPhotos = selectedFolderId
        ? photos.filter((p: any) => p.folderId === selectedFolderId)
        : [];

    return (
        <div className="max-w-6xl mx-auto p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                    {selectedFolderId
                        ? `📁 ${folders.find(f => f.id === selectedFolderId)?.name || "ალბომი"}`
                        : "ფოტოების ალბომები"}
                </h2>

                <div className="flex gap-3">
                    {/* თუ არჩეულია ფოლდერი */}
                    {selectedFolderId !== null ? (
                        <>
                            {mode === "view" && (
                                <>
                                    <button
                                        onClick={() => setMode("add")}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                                    >
                                        ➕ ფოტოს დამატება
                                    </button>
                                    <button
                                        onClick={() => setMode("delete")}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                                    >
                                        🗑️ წაშლა
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => { setSelectedFolderId(null); setMode("view"); }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                            >
                                ⬅️ ალბომებში დაბრუნება
                            </button>
                        </>
                    ) : (
                        /* თუ ვართ მთავარ ფოლდერების გვერდზე */
                        mode === "view" && (
                            <button
                                onClick={() => setMode("addFolder")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                            >
                                📁 ფოლდერის შექმნა
                            </button>
                        )
                    )}

                    {mode !== "view" && selectedFolderId !== null && (
                        <button
                            onClick={() => setMode("view")}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                        >
                            გაუქმება
                        </button>
                    )}

                    {mode === "addFolder" && (
                        <button
                            onClick={() => setMode("view")}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition cursor-pointer"
                        >
                            გაუქმება
                        </button>
                    )}
                </div>
            </div>

            {/* ახალი ფოლდერის შექმნის ფორმა */}
            {mode === "addFolder" && (
                <form
                    onSubmit={handleCreateFolder}
                    className="bg-gray-900 border border-gray-800 p-5 rounded-xl mb-8 flex gap-4 items-center"
                >
                    <input
                        type="text"
                        placeholder="ფოლდერის სახელი..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="flex-1 bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer"
                    >
                        შექმნა
                    </button>
                </form>
            )}

            {/* 1. თუ ფოლდერი არ არის არჩეული - ვაჩვენებთ ფოლდერების სიას */}
            {selectedFolderId === null ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {folders.map((folder) => {
                        const count = photos.filter((p: any) => p.folderId === folder.id).length;
                        return (
                            <div
                                key={folder.id}
                                onClick={() => { setSelectedFolderId(folder.id); setMode("view"); }}
                                className="bg-gray-800 border border-gray-700 p-6 rounded-xl cursor-pointer hover:border-blue-500 transition shadow-lg group flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition">
                                        📁 {folder.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-2">{count} ფოტო</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* 2. თუ ფოლდერი არჩეულია - ვაჩვენებთ შიგთავსს */
                <>
                    {mode === "add" && (
                        <form
                            onSubmit={formik.handleSubmit}
                            className="bg-gray-900 border border-gray-800 p-5 rounded-xl mb-8 flex flex-col sm:flex-row gap-4 items-start"
                        >
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="ფოტოს დასათაურება..."
                                    {...formik.getFieldProps("title")}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                                />
                                {formik.touched.title && formik.errors.title && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.title}</p>
                                )}
                            </div>

                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="ჩააკეთეთ ფოტოს ლინკი (URL)..."
                                    {...formik.getFieldProps("imageUrl")}
                                    className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                                />
                                {formik.touched.imageUrl && formik.errors.imageUrl && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.imageUrl}</p>
                                )}
                            </div>

                            {/* დამალული ინპუტი ფოლდერის აიდისთვის */}
                            <input type="hidden" {...formik.getFieldProps("folderId")} />

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer shrink-0"
                            >
                                შენახვა
                            </button>
                        </form>
                    )}

                    {filteredPhotos.length === 0 ? (
                        <p className="text-gray-500 text-center py-12">ამ ფოლდერში ფოტოები ჯერ არ არის დამატებული.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredPhotos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 relative group"
                                >
                                    <img
                                        src={photo.imageUrl}
                                        alt={photo.title}
                                        onClick={() => {
                                            if (mode === "view") setSelectedImage(photo.imageUrl);
                                        }}
                                        className={`w-full h-56 object-cover ${mode === "view" ? "cursor-pointer hover:scale-105 transition-transform" : ""}`}
                                    />
                                    <div className="p-4 flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-white">{photo.title}</h3>

                                        {mode === "delete" && (
                                            <button
                                                onClick={() => handleDelete(photo.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer"
                                            >
                                                წაშლა
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* სრულეკრანიანი მოდალი */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 cursor-pointer"
                >
                    <img
                        src={selectedImage}
                        alt="Full size"
                        className="max-w-full max-h-[90vh] rounded-lg object-contain shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
}