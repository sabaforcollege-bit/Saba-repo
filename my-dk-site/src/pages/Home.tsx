import { Link } from "react-router-dom";

export function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                კეთილი იყოს თქვენი მობრძანება
            </h1>
            <p className="text-gray-400 max-w-xl mb-8 text-lg">
                აქ თავმოყრილია ჩემი საყვარელი ფოტოები, ვიდეოები და თამაშების კოლექცია.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link
                    to="/photos"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    ფოტოების ნახვა
                </Link>
                <Link
                    to="/videos"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    ვიდეოების ნახვა
                </Link>
                <Link
                    to="/games"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    თამაშების ნახვა
                </Link>
            </div>
        </div>
    );
}