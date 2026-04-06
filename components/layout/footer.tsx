import Link from "next/link";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <div className="bg-secondary w-full px-17">
      <div className="grid grid-cols-4 py-13">
        <div>
          <h3 className="text-secondary-foreground mb-4 text-lg font-bold">Lumina Clean Clinical-grade purity meets botanical soul.</h3>
          <p className="text-gray-600">Expertly cleaning homes and hearts since 2024.</p>
        </div>
        <div>
          <h3 className="text-secondary-foreground mb-4 text-lg font-bold">COMPANY</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/" className="text-gray-600">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/" className="text-gray-600">Terms of Service</Link>
            </li>
            <li>
              <Link href="/" className="text-gray-600">Eco-Commitment</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-secondary-foreground mb-4 text-lg font-bold">CONNECT</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/" className="text-gray-600">Instagram</Link>
            </li>
            <li>
              <Link href="/" className="text-gray-600">LinkedIn</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-secondary-foreground mb-4 text-lg font-bold">TRUST</h3> 
          <Button size="normal">BADGE Fully Insured & Vetted</Button>
        </div>
      </div>
      <hr className="border border-gray-300"></hr>
      <div className="flex justify-center py-7">
        © 2026 Lumina Clinical Cleaning. All rights reserved.
      </div>
    </div>
  );
}
