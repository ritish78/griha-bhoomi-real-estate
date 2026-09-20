const links = {
  github: "https://github.com/ritish78",
  portfolio: "https://ritishtimalsina.com",
  composeSync: "https://github.com/ritish78/ComposeSync",
  byteBuy: "https://github.com/ritish78/ByteBuy",
  storageDrive: "https://github.com/ritish78/Storage-Drive",
  codeShare: "https://github.com/ritish78/CodeShare",
  culinaryCompass: "https://github.com/ritish78/CulinaryCompass"
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "GrihaBhoomi",
  description: "An opensource real-estate website built using Nextjs 16.",
  links,
  mainNav: [
    {
      title: "Property",
      items: [
        {
          title: "House",
          href: "property/search?propertytype=House&page=1",
          description: "View houses that are on sale or for rent!",
          items: []
        },
        {
          title: "Land",
          href: "/property/search?propertytype=Land&page=1",
          description: "View land that are on sale or for rent!",
          items: []
        }
      ]
    },
    {
      title: "Rent",
      items: [
        {
          title: "House",
          href: "/property/search?propertytype=House&status=Rent&page=1",
          description: "View House that are available for rent!",
          items: []
        },
        {
          title: "Land",
          href: "/property/search?propertytype=Land&status=Rent&page=1",
          description: "View Land that are available for rent!",
          items: []
        }
      ]
    },
    {
      title: "Buy",
      items: [
        {
          title: "House",
          href: "/property/search?propertytype=House&status=Sale&page=1",
          description: "View House that are available for sale!",
          items: []
        },
        {
          title: "Land",
          href: "/property/search?propertytype=Land&status=Sale&page=1",
          description: "View Land that are available for sale!",
          items: []
        }
      ]
    }
  ],
  footerNav: [
    {
      title: "Credits",
      items: [
        {
          title: "Skateshop",
          href: "https://github.com/sadmann7/skateshop",
          external: true
        },
        {
          title: "Taxonomy",
          href: "https://github.com/shadcn-ui/taxonomy",
          external: true
        },
        {
          title: "Shadcn/ui",
          href: "https://github.com/shadcn-ui/ui",
          external: true
        },
        {
          title: "OneStopShop",
          href: "https://github.com/jackblatch/OneStopShop",
          external: true
        },
        {
          title: "Omae",
          href: "https://dribbble.com/shots/21710052-Omae-Real-Estate-Dashboard",
          external: true
        },
        {
          title: "D'house",
          href: "https://dribbble.com/shots/21665043-D-house-Real-Estate-Dashboard",
          external: true
        },
        {
          title: "PropertyPro",
          href: "https://dribbble.com/shots/18786348-PropertyPro-Redesign",
          external: true
        }
      ]
    },
    {
      title: "Help",
      items: [
        {
          title: "About",
          href: "/about",
          external: false
        },
        {
          title: "Contact",
          href: "/contact-us",
          external: false
        },
        {
          title: "Terms",
          href: "/terms-and-conditions",
          external: false
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false
        }
      ]
    },
    {
      title: "Social",
      items: [
        {
          title: "Github",
          href: links.github,
          external: true
        },
        {
          title: "Portfolio",
          href: links.portfolio,
          external: true
        }
      ]
    },
    {
      title: "Projects",
      items: [
        {
          title: "ComposeSync",
          href: links.composeSync,
          external: true
        },
        {
          title: "ByteBuy",
          href: links.byteBuy,
          external: true
        },
        {
          title: "StorageDrive",
          href: links.storageDrive,
          external: true
        },
        {
          title: "CodeShare",
          href: links.codeShare,
          external: true
        },
        {
          title: "CulinaryCompass",
          href: links.culinaryCompass,
          external: true
        }
      ]
    }
  ]
};
