import Navbar from "@/app/components/global/Navbar";
import Footer from "@/app/components/global/Footer";
import GlobalHero from "@/app/components/global/GlobalHero";

export default function Registration() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen brightness-95  bg-[url(/content/regist-hero.jpg)] bg-cover bg-center  w-screen  h-screen bg-no-repeat  z-0 bg-fixed">
        {" "}
        <div className="h-screen   backdrop-blur-sm  p-6 flex flex-col text-center gap-14 items-center ">
          <h1 className="mt-30 font-['Telma-Bold'] text-6xl  text-[#f0ac2d] text-shadow-lg text-shadow-[#f7edd3]  md:text-6xl lg:text-8xl   ">
            Pra-Event Registration
          </h1>
          <form
            action=""
            className="flex flex-col gap-5 w-screen justify-center items-center "
          >
            <div className="w-3/4">
              <div className="text-left flex flex-col ">
                <label
                  htmlFor=""
                  className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
                />
              </div>
              <div className="text-left  flex flex-col ">
                <label
                  htmlFor=""
                  className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
                />
              </div>
              <div className="text-left  flex flex-col">
                <label
                  htmlFor=""
                  className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold"
                >
                  No Whatsapp
                </label>
                <input
                  type="number"
                  className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg  "
                />
              </div>
              <div className="text-left  flex flex-col">
                <label
                  htmlFor=""
                  className="w-full p-2.5  font-['body-medium']  text-[#00354E] text-shadow-sm font-bold"
                >
                  Mau Ikut Event Apa?
                </label>
                <select
                  name=""
                  id=""
                  className="w-full p-2.5 rounded-4xl font-['body-regular']  text-[#00354E] bg-white ring ring-[#30B5D8] shadow-lg"
                >
                  <option value="FUN_RUN">Fun Run 7K</option>
                  <option value="MEWARNAI">Lomba Mewarnai</option>
                  <option value="TALENT_SHOW">Smancir Talent Mini Show</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="font-['body-bold'] bg-[#00354E] shadow-lg w-44 h-12  text-center p-2 text-white rounded-full "
            >
              {" "}
              SUBMIT
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
