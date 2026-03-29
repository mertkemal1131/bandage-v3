import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="font-['Montserrat'] bg-white min-h-[600px] flex items-center justify-center py-[100px] px-6">
      <div className="flex flex-col items-center text-center max-w-[600px] mx-auto gap-[35px]">

        {/* Heading */}
        <h1 className="font-bold text-[40px] leading-[50px] text-[#252B42] m-0">
          Get answers to all your questions.
        </h1>

        {/* Subtitle */}
        <p className="font-normal text-[14px] leading-[20px] text-[#737373] m-0 max-w-[500px]">
          Problems trying to resolve the conflict between the two major realms of Classical physics:
        </p>

        {/* CTA Button */}
        <button className="bg-[#23A6F0] text-white border-none rounded-[5px]
                           py-[15px] px-[40px] cursor-pointer
                           font-['Montserrat'] font-bold text-[14px] leading-[22px] tracking-[0.2px]
                           hover:bg-[#1a8fd1] transition-colors duration-200 w-full md:w-auto">
          CONTACT OUR COMPANY
        </button>

        {/* Social icons */}
        <div className="flex items-center gap-[25px]">
          {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
            <a key={i} href="#"
              className="text-[#BDBDBD] hover:text-[#252B42] transition-colors duration-200">
              <Icon size={28} strokeWidth={1.5} />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}