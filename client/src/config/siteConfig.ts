const links = {
  github: "https://github.com/ritish78"
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
  ]
};
