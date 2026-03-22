import { Link } from 'react-router-dom';
import { Target, BarChart2, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { n: '15K',  l: 'Happy Customers'   },
    { n: '150K', l: 'Monthly Visitors'  },
    { n: '15',   l: 'Countries Worldwide'},
    { n: '100+', l: 'Top Partners'      },
  ];
  const team = [
    { name: 'Username', role: 'Profession', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
    { name: 'Username', role: 'Profession', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face' },
    { name: 'Username', role: 'Profession', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  ];

  return (
    <div className="font-['Montserrat'] bg-white">

      {/* Breadcrumb */}
      <div className="bg-[#FAFAFA] py-10 text-center border-b border-[#E8E8E8]">
        <h1 className="font-bold text-[24px] text-[#252B42] mb-2">About Us</h1>
        <div className="flex justify-center gap-2 font-bold text-[14px] text-[#737373]">
          <Link to="/" className="text-[#252B42] no-underline">Home</Link>
          <span className="text-[#BDBDBD]">›</span>
          <span>About</span>
        </div>
      </div>

      {/* Hero split */}
      <div className="flex flex-col md:flex-row max-w-[1050px] mx-auto px-6 py-20 gap-[60px] items-center">
        <div className="flex flex-col gap-5 flex-1">
          <h2 className="font-bold text-[40px] leading-[50px] text-[#252B42] tracking-[0.2px]">About Us</h2>
          <p className="font-normal text-[14px] text-[#737373] leading-6">
            We know how large objects will act, but things on a small scale just do not act that way. Scientific
            rigor brings us to design products that work for you. Our mission is to bring world-class quality
            fashion to everyone, everywhere.
          </p>
          <p className="font-normal text-[14px] text-[#737373] leading-6">
            Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian
            mechanics and electromagnetism led to the development of our brand philosophy.
          </p>
          <Link to="/shop" className="inline-block bg-[#23A6F0] text-white py-[14px] px-[40px] rounded-[5px] font-bold text-[14px] no-underline w-fit">
            Shop Now
          </Link>
        </div>
        <div className="flex flex-1 h-[380px]">
          {[
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=400&fit=crop',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop',
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="flex-1 h-full object-cover min-w-0" />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#FAFAFA] py-[60px]">
        <div className="max-w-[1050px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-normal text-[20px] text-[#737373] mb-2">Fun Facts About Us</p>
            <h2 className="font-bold text-[40px] text-[#252B42] leading-[50px]">Why choose us</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.map(({ n, l }) => (
              <div key={l} className="flex flex-col items-center bg-white rounded-[5px] py-10 px-6 text-center border border-[#E8E8E8] flex-1 min-w-[180px]">
                <h3 className="font-bold text-[40px] text-[#252B42] mb-2">{n}</h3>
                <p className="font-bold text-[16px] text-[#737373]">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20">
        <div className="max-w-[1050px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-normal text-[20px] text-[#737373] mb-2">Meet Our Team</p>
            <h2 className="font-bold text-[40px] text-[#252B42] leading-[50px]">Meet our great team</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-[30px]">
            {team.map(({ name, role, img }) => (
              <div key={name + role} className="text-center flex-1 min-w-[240px] max-w-[320px]">
                <img src={img} alt={name} className="w-full aspect-square object-cover rounded-[5px] mb-4" />
                <h4 className="font-bold text-[16px] text-[#252B42] mb-1">{name}</h4>
                <p className="font-bold text-[14px] text-[#737373]">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-[#FAFAFA] py-20">
        <div className="max-w-[1050px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-normal text-[20px] text-[#737373] mb-2">Featured Products</p>
            <h2 className="font-bold text-[40px] text-[#252B42]">THE BEST SERVICES</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { Icon: Target,    bg: 'bg-[#EBF8FF]', c: '#23A6F0', title: 'Easy Wins',   desc: 'Get your best looking smile now!' },
              { Icon: BarChart2, bg: 'bg-[#EAFAF3]', c: '#2DC071', title: 'Concrete',    desc: 'Assurance that blocks are in the right place.' },
              { Icon: TrendingUp,bg: 'bg-[#FFF4EE]', c: '#E77C40', title: 'Hack Growth', desc: 'Problems trying to resolve the conflict.' },
            ].map(({ Icon, bg, c, title, desc }) => (
              <div key={title} className="flex flex-col items-center bg-white py-10 px-6 text-center rounded-[5px] border border-[#E8E8E8] flex-1 min-w-[240px]">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${bg}`}>
                  <Icon size={22} color={c} />
                </div>
                <h3 className="font-bold text-[16px] text-[#252B42] mb-2">{title}</h3>
                <p className="font-normal text-[14px] text-[#737373] leading-5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
