import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full py-3 px-[15%]">
            <nav className="flex gap-[20px]">
                <Link href={"/lol"}>Lol</Link>
            </nav>
        </header>
    )
}