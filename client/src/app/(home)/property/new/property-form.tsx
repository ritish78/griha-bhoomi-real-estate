"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Icons } from "@/components/icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utlis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toaster";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { createProperty } from "@/actions/property";

// Schema definition based on user request (combining Property, Address, Land, House)
const propertyFormSchema = z.object({
  // Basic Property Details
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  negotiable: z.boolean().default(false),
  toRent: z.boolean().default(false), // false = Sale, true = Rent
  propertyType: z.enum(["House", "Land"]),
  status: z.enum(["Sale", "Rent", "Hold", "Sold"]).default("Sale"),
  availableFrom: z.date({
    required_error: "Available from date is required"
  }),
  availableTill: z.date({
    required_error: "Available till date is required"
  }),

  // Address
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  municipality: z.string().optional(),
  wardNumber: z.coerce.number().optional(),
  province: z.string().min(2, "Province is required"),
  houseNumber: z.string().optional(),
  closeLandmark: z.string().optional(),
  imageUrl: z.array(z.string()).optional().default([]),

  //For House
  houseType: z.string().optional().default("House"),
  roomCount: z.coerce.number().optional().default(0),
  bathroomCount: z.coerce.number().optional().default(0),
  floorCount: z.coerce.number().optional().default(0),
  kitchenCount: z.coerce.number().optional().default(0),
  furnished: z.boolean().optional().default(false),
  facing: z.string().optional(),
  carParking: z.coerce.number().optional().default(0),
  bikeParking: z.coerce.number().optional().default(0),
  builtAt: z.coerce.date().optional(), // Changed to coerce date
  sharedBathroom: z.boolean().optional().default(false),
  facilities: z.array(z.string()).optional().default([]),
  evCharging: z.boolean().optional().default(false),

  //For Land
  landType: z.string().optional(),
  landArea: z.string().optional(),
  length: z.string().optional(),
  breadth: z.string().optional(),

  //For both House and Land
  connectedToRoad: z.boolean().optional(),
  distanceToRoad: z.coerce.number().optional()
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function PropertyForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  //Setting defaults
  const defaultValues: Partial<PropertyFormValues> = {
    title: "",
    description: "",
    price: 0,
    negotiable: false,
    toRent: false,
    propertyType: "House",
    status: "Sale",
    street: "",
    city: "",
    district: "",
    province: "",
    connectedToRoad: true,
    houseType: "House",
    sharedBathroom: false,
    facilities: ["24 hour Water", "24 hour Electricity"],
    evCharging: false,
    furnished: false,
    bikeParking: 0
  };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues
  });

  const propertyType = form.watch("propertyType");
  const connectedToRoad = form.watch("connectedToRoad");

  const availableFrom = form.watch("availableFrom");
  const availableTill = form.watch("availableTill");
  const isHouse = propertyType === "House";

  useEffect(() => {
    if (connectedToRoad) {
      form.setValue("distanceToRoad", 0);
    }
  }, [connectedToRoad, form]);

  //When the user selects avaliable from to be a specific date and available date
  //and then goes back to change the available from date to later than available till
  //it changes the available till to be 1 day after the available from
  useEffect(() => {
    if (availableFrom && availableTill && availableFrom >= availableTill) {
      const nextDay = new Date(availableFrom);
      nextDay.setDate(nextDay.getDate() + 1);
      form.setValue("availableTill", nextDay);
    }
  }, [availableFrom, availableTill, form]);

  async function onSubmit(data: PropertyFormValues) {
    setIsLoading(true);

    try {
      //Making the date set from the frontend to match with what the backend wants
      //E.g. 2026-04-01T12:00:00Z
      const adjustDate = (date: Date) => {
        if (!date) return undefined;
        const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return adjustedDate.toISOString();
      };

      const payload = {
        ...data,
        imageUrl: [
          "https://placehold.co/600x400.png",
          "https://placehold.co/800x800.png",
          "https://placehold.co/1200x1000.png"
        ], // TODO: change the images to what the user uploads. These are default test images and is for test only.
        area: data.landArea || "",
        builtAt: data.builtAt ? adjustDate(new Date(data.builtAt)) : adjustDate(new Date()),
        availableFrom: adjustDate(new Date(data.availableFrom)),
        availableTill: adjustDate(new Date(data.availableTill))
      };

      const result = await createProperty(payload);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Property Listed", {
        description: "Your property has been successfully listed."
      });

      //Resetting the fields
      form.reset();

      //Redirecting to the newly created property page
      //property/${result.slug}
      router.push(`/property/${result.slug}`);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Error", {
        description: error.message || "Something went wrong. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Information */}
        <Card>
          <div className="h-1 w-full bg-primary/80 rounded-t-md" />
          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details about the property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sale">For Sale</SelectItem>
                        <SelectItem value="Rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern 2-Storey House in Kathmandu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the property features, neighborhood, etc."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (NPR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="negotiable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-8">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Negotiable</FormLabel>
                      <FormDescription>Is the price open to negotiation?</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Available From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableTill"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Available Till</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <Icons.calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || (availableFrom && date <= availableFrom)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Address */}
        <Card>
          <div className="h-1 w-full bg-primary/80 rounded-t-md" />
          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>Location Details</CardTitle>
            <CardDescription>Where is the property located?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kathmandu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/VDC</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Balaju" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Province" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Koshi">Koshi</SelectItem>
                        <SelectItem value="Madhesh">Madhesh</SelectItem>
                        <SelectItem value="Bagmati">Bagmati</SelectItem>
                        <SelectItem value="Gandaki">Gandaki</SelectItem>
                        <SelectItem value="Lumbini">Lumbini</SelectItem>
                        <SelectItem value="Karnali">Karnali</SelectItem>
                        <SelectItem value="Sudurpaschim">Sudurpaschim</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kathmandu Metro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street / Tole</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sano Bharyang Marg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward Number</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="houseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1-2-3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closeLandmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearby Landmark</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Near Big Mart" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Property Details (Dynamic) */}
        <Card>
          <div className="h-1 w-full bg-primary/80 rounded-t-md" />
          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>{isHouse ? "House Details" : "Land Details"}</CardTitle>
            <CardDescription>
              Specific features of the {isHouse ? "house" : "land"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Common Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="connectedToRoad"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Connected to Road</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="distanceToRoad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance to Road (ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} disabled={connectedToRoad} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            {/* HOUSE SPECIFIC */}
            {isHouse && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="roomCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="floorCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floors</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bathroomCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kitchenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kitchens</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="carParking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Parking</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="builtAt"
                  render={({ field }) => {
                    const currentYear = new Date().getFullYear();
                    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
                      (currentYear - i).toString()
                    );

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel>Built Year</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? new Date(field.value).getFullYear().toString()
                                  : "Select year"}
                                <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search year..." />
                              <CommandList>
                                <CommandEmpty>No year found.</CommandEmpty>
                                <CommandGroup>
                                  {years.map((year) => (
                                    <CommandItem
                                      key={year}
                                      value={year}
                                      onSelect={(currentValue) => {
                                        // Create a date for Jan 1st of the selected year
                                        // constructing date string YYYY-01-01 to ensure coercion works as expected
                                        const date = new Date(`${currentValue}-01-01`);
                                        field.onChange(date);
                                      }}
                                    >
                                      <Icons.check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value &&
                                            new Date(field.value).getFullYear().toString() === year
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {year}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="facing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facing Direction</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select direction" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="North">North</SelectItem>
                          <SelectItem value="East">East</SelectItem>
                          <SelectItem value="West">West</SelectItem>
                          <SelectItem value="South">South</SelectItem>
                          <SelectItem value="North-East">North-East</SelectItem>
                          <SelectItem value="North-West">North-West</SelectItem>
                          <SelectItem value="South-East">South-East</SelectItem>
                          <SelectItem value="South-West">South-West</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="furnished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm col-span-1">
                      <div className="space-y-0.5">
                        <FormLabel>Furnished</FormLabel>
                        <FormDescription>Is the house furnished?</FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* LAND SPECIFIC */}
            {!isHouse && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="landArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Area (sq ft/aana)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 4 Aana" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Agricultural">Agricultural</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (ft)</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breadth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breadth (ft)</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 4: Images (Placeholder) */}
        <Card>
          <div className="h-1 w-full bg-primary/80 rounded-t-md" />
          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>Property Images</CardTitle>
            <CardDescription>Upload images of your property.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 border-gray-300 dark:border-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Icons.cloudUpload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <input id="dropzone-file" type="file" accept="image/jpeg, image/png, image/jpg, image/webp image/gif" className="hidden" multiple />
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="mx-auto flex w-fit group" disabled={isLoading}>
            {isLoading ? "Listing..." : "Create New Property Listing"}
            {!isLoading ? (<Icons.rightArrow
              className="ml-1 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />) : (<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
