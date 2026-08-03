import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/shop/banner.png"
          alt="Tienda veterinaria Luma Vet"
          fill
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17322c]/80 via-[#17322c]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:py-24">
        <p className="mb-3 w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-[#9dc7b3] backdrop-blur-sm">
          Tienda veterinaria
        </p>

        <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          Todo lo que tu mascota necesita, en un solo lugar.
        </h2>

        <p className="mt-4 max-w-md text-base leading-7 text-white/80">
          Alimentos, accesorios, medicamentos y productos de cuidado seleccionados por nuestros veterinarios.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/tienda"
            className="inline-flex h-11 items-center rounded-full bg-[#2a6a5d] px-6 text-sm font-semibold text-white transition hover:bg-[#1f5248]"
          >
            Ver productos
          </Link>
          <Link
            href="#categorias"
            className="inline-flex h-11 items-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Ver categorías
          </Link>
        </div>
      </div>
    </section>
  );
}

