import logo_dark from '@/assets/logodark.svg'
import logo_light from '@/assets/logodark.svg'
import { Bars3Icon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { WalletIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import Container from './Container'

export default function Header() {
  const ref = useRef(null)
  const [isSticked, setIsSticked] = useState(false)

  useEffect(() => {
    const cachedRef = ref.current,
      observer = new IntersectionObserver(([e]) => setIsSticked(e.intersectionRatio < 1), {
        threshold: [1],
      })
    if (cachedRef) observer.observe(cachedRef)
    return () => {
      if (cachedRef) observer.unobserve(cachedRef)
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky -top-[0.1px] z-50 transition-colors duration-150',
        isSticked ? 'border-b bg-white text-black' : 'text-white'
      )}
      ref={ref}
    >
      <Container>
        <div className="flex h-[4.25rem] items-center gap-x-2 py-2.5">
         <button className="hidden sm:block h-full px-1 xl:hidden" id="openModal">
            <Bars3Icon className="h-8 w-8" />
          </button>
          <div className="flex h-full items-center">
            <div className="relative w-40">
            <a href="/#connect"> <img
                src={isSticked ? logo_dark : logo_light}
                loading="eager"
                className="absolute inset-0 my-auto object-contain"
                alt="logo"
              /></a>
            </div>
            <ul
              className={clsx(
                'ml-6 hidden gap-x-6 border-l pl-6 font-semibold xl:flex',
                isSticked ? 'border-slate-200' : 'border-white/20'
              )}
            >
              <li>
                <a href="/#connect">Drops</a>
              </li>
              <li>
                <a href="/#connect">Stats</a>
              </li>
            </ul>
          </div>
          <div className="relative ml-6 hidden h-full flex-1 sm:block">
            <MagnifyingGlassIcon
              className={clsx('absolute inset-y-0 left-3 z-10 my-auto h-5 w-5 stroke-2', isSticked && 'text-slate-500')}
            />
            <input
              name="Search"
              type="text"
              className={clsx(
                'h-full w-full rounded-xl border bg-white/10 pl-10 hover:bg-white/20 focus:ring-0',
                isSticked
                  ? 'border-slate-200 focus:border-slate-200'
                  : 'border-transparent placeholder:text-slate-200 focus:border-transparent'
              )}
              placeholder="Search items, collections, and accounts"
            />
          </div>
          <div className="h-full justify-end ml-auto flex">
          <a href="/#connect"><button 
              className={clsx(
                'flex h-full items-center rounded-l-xl border-y border-l bg-white/10 px-4 font-semibold hover:bg-white/20',
                !isSticked && 'border-transparent'
              )}
            >
              <WalletIcon className="mr-2 h-6 w-6 stroke-2" />
              <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
            </button></a>
            <a href="/#connect"><button
              className={clsx(
                'h-full rounded-r-xl border bg-white/10 px-3 hover:bg-white/20',
                !isSticked && 'border-transparent border-l-white/20'
              )}
            >
              <UserCircleIcon className="h-6 w-6 stroke-2" />
            </button></a>
          </div>
          
         
        </div>
      </Container>
    
    </header>
  )
}
