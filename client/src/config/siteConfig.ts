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
  description: "An opensource real-estate website built using Nextjs 14.",
  links,
  mainNav: [
    {
      title: "Property",
      items: [
        {
          title: "Rent",
          href: "/rent",
          description: "View or add property for rent!",
          items: []
        },
        {
          title: "Buy",
          href: "/sale",
          description: "View property that you want to buy or, add property for sale!",
          items: []
        }
      ]
    },
    {
      title: "Rent",
      items: [
        {
          title: "Land",
          href: "/rent/land",
          description: "View Land that are available for rent!",
          items: []
        },
        {
          title: "House",
          href: "/rent/house",
          description: "View House that are available for rent!",
          items: []
        }
      ]
    },
    {
      title: "Buy",
      items: [
        {
          title: "Land",
          href: "/sale/land",
          description: "View Land that are available for sale!",
          items: []
        },
        {
          title: "House",
          href: "/sale/house",
          description: "View House that are available for sale!",
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
