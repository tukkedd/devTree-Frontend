import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { updateProfile } from "../api/DevTreeAPI"
import { SocialNetwork, User } from "../types"

export default function LinkTreeView() {

  const [devTreeLinks, setDevTreeLinks] = useState(social)

  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(['user'])!

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Actualizado Correctamente')
    }
  })

  useEffect(() => {
    const updatedData = devTreeLinks.map(item => {
      const userLink = JSON.parse(user.links).find(link => link.name === item.name)
      if (userLink) {
        return { ...item, url: userLink.url, enabled: userLink.enabled }
      }
      return item
    })
    setDevTreeLinks(updatedData)
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? { ...link, url: e.target.value } : link)
    setDevTreeLinks(updatedLinks)

    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedLinks)
      }
    })

  }

  const links: SocialNetwork[] = JSON.parse(user.links)


  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled }
        } else {
          toast.error('URL No Valida')
        }
      }
      return link
    })
    setDevTreeLinks(updatedLinks)

    // Solo los links habilitados
    const enabledLinks = updatedLinks
      .filter(link => link.enabled)
      .map((link, idx) => ({
        ...link,
        id: idx + 1 // id consecutivo según la cantidad de seleccionados
      }));

    console.log(enabledLinks); // Aquí el length será igual a la cantidad de seleccionados

    // Guarda solo los habilitados en el usuario
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(enabledLinks)
      }
    })
  }

  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map(item => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
          />
        ))}
        <button
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded font-bold"
          onClick={() => mutate(user)}
        >
          Guardar Cambios
        </button>
      </div>
    </>
  )
}

// const links: SocialNetwork[] = JSON.parse(user.links)

// const handleEnableLink = (socialNetwork: string) => {
//   const updatedLinks = devTreeLinks.map(link => {
//     if (link.name === socialNetwork) {
//       if (isValidUrl(link.url)) {
//         return { ...link, enabled: !link.enabled }
//       } else {
//         toast.error('URL No Valida')
//       }
//     }
//     return link
//   })
//   setDevTreeLinks(updatedLinks)


//   let updatedItems: SocialNetwork[] = []
//   const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork)

//   if (selectedSocialNetwork?.enabled) {
//     const newItem = {
//       ...selectedSocialNetwork,
//       id: links.length + 1
//     }

//     updatedItems = [...links, newItem]
//     console.log(updatedItems);


//   } else {
//     console.log('deshabiloi');
//   }

//   console.log(updatedItems);