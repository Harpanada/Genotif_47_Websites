"use client";

export default function Map() {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-5 h-full  z-10 gap-6 min-h-screen">
      <h1 className="text-[#00354E] font-['Telma-Medium'] text-4xl p-5 text-shadow-lg md:text-5xl">
        Location
      </h1>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7923.206107979444!2d107.247147!3d-6.818038!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6855009e0b02e7%3A0xc4c4e708d1ad2564!2sSMAN%201%20CIRANJANG!5e0!3m2!1sen!2sus!4v1789673550863!5m2!1sen!2sus"
        className="flex items-center justify-center h-72 md:h-80 lg:h-96  w-11/12 rounded-xl overflow-hidden shadow-lg bg-white   p-2"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"></iframe>
    </div>
  );
}
