import { BiLogoFacebook, BiLogoInstagram, BiLogoYoutube } from "react-icons/bi";
import { TbWorld } from "react-icons/tb";

const socials = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/caminodevida",
    icon: <BiLogoFacebook size={20} />,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/caminodevida",
    icon: <BiLogoInstagram size={20} />,
  },
  {
    label: "Youtube",
    url: "https://www.youtube.com/caminodevida",
    icon: <BiLogoYoutube size={20} />,
  },
  {
    label: "Web",
    url: "https://caminodevida.com",
    icon: <TbWorld size={20} />,
  },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='container grid min-h-screen place-items-center'>
      <div className='grid w-full grid-cols-2 justify-center border border-border'>
        <div className='flex flex-col items-center gap-y-5 px-8 py-5'>
          <div className='h-20 w-20 border'>Logo</div>

          {/* <AuthNavlinks /> */}

          {children}
        </div>

        <div className='relative h-full min-h-[400px] w-full bg-slate-600 text-white'>
          <div className='absolute right-2 top-2 flex gap-x-4'>
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target='_blank'
                rel='noreferrer'
                className='flex items-center gap-x-2'
              >
                {social.icon}
                <span className='sr-only'>{social.label}</span>
              </a>
            ))}
          </div>

          {/* Imagen */}
        </div>
        <div className='col-span-2 grid h-11 w-full place-items-center bg-[#F29A7F] text-center font-medium text-white'>
          Si tienes preguntas escríbenos a grupos@caminodevida.com
        </div>
      </div>
    </main>
  );
}
