"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRouter } from "next/navigation";
import { createProperty, updateProperty } from "@/actions/property";
import { uploadMultipleToCloudinary } from "@/lib/cloudinaryUpload";
import { ImagePreview } from "@/components/image-preview";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isFacilityAllowed } from "@/types/facilities";
import { FacilitiesPicker } from "@/components/property-facilities";
import BuiltYearFilter from "@/components/built-year";
import { propertyFormSchema, PropertyFormValues } from "@/lib/propertyFormSchema";
import Link from "next/link";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("./location-picker-map"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="flex h-[400px] w-full items-center justify-center rounded-lg border bg-muted/40"
    >
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  )
});

const fieldLabel = (name: string) =>
  name.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

type PropertyFormProps = {
  editSlug?: string;
  initialValues?: Partial<PropertyFormValues>;
};

export function PropertyForm({ editSlug, initialValues }: PropertyFormProps) {
  const isEditing = Boolean(editSlug);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(() => [
    ...(initialValues?.imageUrl ?? [])
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [locationMode, setLocationMode] = useState<"map" | "manual">("manual");
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);

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
    municipality: "",
    wardNumber: 0,
    houseNumber: "",
    latitude: null,
    longitude: null,
    closeLandmark: "",
    connectedToRoad: true,
    distanceToRoad: 0,
    houseType: "House",
    roomCount: 0,
    floorCount: 0,
    bathroomCount: 0,
    kitchenCount: 0,
    carParking: 0,
    sharedBathroom: false,
    facilities: [],
    evCharging: false,
    furnished: false,
    bikeParking: 0,
    area: "",
    areaUnit: "sq-ft",
    landType: "",
    length: "",
    breadth: ""
  };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues
    }
  });

  const propertyType = form.watch("propertyType");
  const connectedToRoad = form.watch("connectedToRoad");

  const availableFrom = form.watch("availableFrom");
  const availableTill = form.watch("availableTill");
  const isHouse = propertyType === "House";

  const onInvalid: SubmitErrorHandler<PropertyFormValues> = (errors) => {
    //Address fields can be hidden by the map tab while still being required.
    if (
      errors.street ||
      errors.city ||
      errors.district ||
      errors.province ||
      errors.municipality ||
      errors.wardNumber ||
      errors.houseNumber
    ) {
      setLocationMode("manual");
    }

    toast.error("Please check the listing details", {
      description: Object.entries(errors)
        .map(([name, error]) => `${fieldLabel(name)}: ${error?.message ?? "Invalid value"}`)
        .join(". ")
    });
  };

  useEffect(() => {
    if (connectedToRoad && (!isEditing || form.getFieldState("connectedToRoad").isDirty)) {
      form.setValue("distanceToRoad", 0);
    }
  }, [connectedToRoad, form, isEditing]);

  useEffect(() => {
    if (isEditing) return;

    if (availableFrom && availableTill && availableFrom >= availableTill) {
      const nextDay = new Date(availableFrom);
      nextDay.setDate(nextDay.getDate() + 1);

      form.setValue("availableTill", nextDay);
    }
  }, [availableFrom, availableTill, form, isEditing]);

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array
    const fileArray = Array.from(files);

    // Validate total images (max 10)
    if (uploadedImages.length + fileArray.length > 10) {
      toast.error("Too many images", {
        description: `You can upload a maximum of 10 images. You have ${uploadedImages.length} and are trying to add ${fileArray.length} more.`
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Cloudinary
      const results = await uploadMultipleToCloudinary(
        fileArray,
        "properties",
        (completed, total) => {
          setUploadProgress((completed / total) * 100);
        }
      );

      // Filter successful uploads
      const successfulUploads = results
        .filter((result) => result.success && result.url)
        .map((result) => result.url!);

      const failedUploads = results.filter((result) => !result.success);

      if (successfulUploads.length > 0) {
        setUploadedImages((prev) => [...prev, ...successfulUploads]);
        toast.success("Images uploaded", {
          description: `Successfully uploaded ${successfulUploads.length} image(s).`
        });
      }

      if (failedUploads.length > 0) {
        toast.error("Some uploads failed", {
          description: `${failedUploads.length} image(s) failed to upload. ${failedUploads[0] && failedUploads[0].error}`
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: "An error occurred while uploading images."
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed", {
      description: "The image has been removed from your listing."
    });
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Trigger the same upload logic
    const event = {
      target: { files }
    } as React.ChangeEvent<HTMLInputElement>;

    await handleFileChange(event);
  };

  async function onSubmit(data: PropertyFormValues) {
    if (isLoading || isUploading || isResolvingAddress) {
      return;
    }

    if (uploadedImages.length === 0) {
      toast.error("Add at least one property image.");
      return;
    }

    if (data.availableTill <= data.availableFrom) {
      form.setError("availableTill", {
        type: "manual",
        message: "Available till must be after available from."
      });
      return;
    }

    if (isEditing && data.propertyType === "House" && !data.builtAt) {
      form.setError("builtAt", {
        type: "manual",
        message: "Please select the built year."
      });
      return;
    }

    setIsLoading(true);

    try {
      const adjustDate = (date: Date) => {
        const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        return adjustedDate.toISOString();
      };

      // Preserve unchanged saved timestamps exactly.
      const serializeDate = (value: Date, original: Date | undefined) => {
        if (isEditing && original && value.getTime() === original.getTime()) {
          return original.toISOString();
        }

        return adjustDate(value);
      };

      const payload = {
        ...data,
        imageUrl: uploadedImages,
        area: `${data.area} ${data.areaUnit.replace("-", " ")}`,

        // Do not overwrite the saved bike-parking value during edits.
        bikeParking: isEditing ? data.bikeParking : data.carParking * 3,

        builtAt: data.builtAt
          ? serializeDate(data.builtAt, initialValues?.builtAt)
          : data.propertyType === "House"
            ? adjustDate(new Date())
            : undefined,

        availableFrom: serializeDate(data.availableFrom, initialValues?.availableFrom),

        availableTill: serializeDate(data.availableTill, initialValues?.availableTill),

        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null
      };

      const result = editSlug
        ? await updateProperty(editSlug, payload)
        : await createProperty(payload);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(isEditing ? "Property updated" : "Property listed", {
        description: isEditing
          ? "Your changes have been saved."
          : "Your property has been successfully listed."
      });

      router.push(`/property/${result.slug}`);
      router.refresh();
    } catch (error) {
      toast.error(isEditing ? "Could not update property" : "Could not list property", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLocationSelect(latitude: number, longitude: number) {
    // Always preserve the exact user-selected location.
    form.setValue("latitude", latitude, {
      shouldDirty: true,
      shouldValidate: true
    });

    form.setValue("longitude", longitude, {
      shouldDirty: true,
      shouldValidate: true
    });

    setResolvedAddress(null);

    try {
      setIsResolvingAddress(true);

      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString()
      });

      const response = await fetch(`${API_URL}/api/v1/geo/reverse?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed with status ${response.status}`);
      }

      const data = await response.json();

      setResolvedAddress(data.displayName ?? null);

      if (data.houseNumber) {
        form.setValue("houseNumber", data.houseNumber, {
          shouldDirty: true
        });
      }

      if (data.street) {
        form.setValue("street", data.street, {
          shouldDirty: true
        });
      }

      if (data.wardNumber != null) {
        form.setValue("wardNumber", Number(data.wardNumber), {
          shouldDirty: true
        });
      }

      if (data.municipality) {
        form.setValue("municipality", data.municipality, {
          shouldDirty: true
        });
      }

      if (data.city) {
        form.setValue("city", data.city, {
          shouldDirty: true
        });
      }

      if (data.district) {
        form.setValue("district", data.district, {
          shouldDirty: true
        });
      }

      if (data.province) {
        form.setValue("province", data.province, {
          shouldDirty: true
        });
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    } finally {
      setIsResolvingAddress(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        onInvalidCapture={(event) => {
          //Native constraints run before React Hook Form's submit handler.
          const input = event.target as HTMLInputElement;
          toast.error("Please check the listing details", {
            description: `${input.labels?.[0]?.textContent || input.name || "Field"}: ${input.validationMessage}`
          });
        }}
        className="space-y-8"
      >
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
                disabled={isEditing}
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      disabled={isEditing}
                      value={field.value}
                      onValueChange={(next) => {
                        if (next !== "House" && next !== "Land") return;

                        field.onChange(next);

                        const current = form.getValues("facilities") ?? [];

                        form.setValue(
                          "facilities",
                          current.filter((id) => isFacilityAllowed(id, next)),
                          {
                            shouldDirty: true,
                            shouldValidate: true
                          }
                        );
                      }}
                    >
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
                    {isEditing && (
                      <FormDescription>
                        The property type cannot be changed after listing.
                      </FormDescription>
                    )}
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
                      <Input type="number" step="any" placeholder="0" {...field} />
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
                            type="button"
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
                            type="button"
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

        <Card>
          <div className="h-1 w-full rounded-t-md bg-primary/80" />

          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>Location Details</CardTitle>
            <CardDescription>Where is the property located?</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              value={locationMode}
              onValueChange={(value) => setLocationMode(value as "map" | "manual")}
              className="w-full"
            >
              {/* Tabs at the top */}
              <TabsList className="mb-6 gap-5">
                <TabsTrigger value="manual" className="gap-2">
                  <Icons.keyboard className="size-4" />
                  Enter manually
                </TabsTrigger>

                <TabsTrigger value="map" className="gap-2">
                  <Icons.mapPin className="size-4" />
                  Select on map
                </TabsTrigger>
              </TabsList>

              {/* MAP */}
              <TabsContent value="map" className="mt-0 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Click on the map to mark the exact location of the property.
                  </p>
                </div>

                <LocationPickerMap
                  latitude={form.watch("latitude")}
                  longitude={form.watch("longitude")}
                  onSelect={handleLocationSelect}
                />

                {isResolvingAddress && (
                  <div className="rounded-md border bg-muted/40 px-4 py-3">
                    <p className="text-sm text-muted-foreground">Finding address...</p>
                  </div>
                )}

                {!isResolvingAddress &&
                  form.watch("latitude") != null &&
                  form.watch("longitude") != null && (
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Selected location</p>

                          {resolvedAddress && (
                            <p className="text-sm text-muted-foreground">{resolvedAddress}</p>
                          )}

                          <p className="text-xs text-muted-foreground">
                            {Number(form.watch("latitude")).toFixed(6)},{" "}
                            {Number(form.watch("longitude")).toFixed(6)}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setLocationMode("manual")}
                        >
                          <Icons.keyboard className="mr-2 size-4" />
                          Edit address
                        </Button>
                      </div>
                    </div>
                  )}
              </TabsContent>

              {/* MANUAL */}
              <TabsContent value="manual" className="mt-0 space-y-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Enter the property address details below.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Balaju" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>

                        <Select onValueChange={field.onChange} value={field.value}>
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                </div>
              </TabsContent>
            </Tabs>

            {/* Shared field */}
            <div className="mt-6 border-t pt-6">
              <FormField
                control={form.control}
                name="closeLandmark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearby Landmark</FormLabel>

                    <FormControl>
                      <Input placeholder="e.g. Near Big Mart" {...field} />
                    </FormControl>

                    <FormDescription>
                      Optional landmark that makes the property easier to find.
                    </FormDescription>

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
                      <Input
                        type="number"
                        step="any"
                        placeholder="0"
                        {...field}
                        disabled={connectedToRoad}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isHouse ? "House Area" : "Land Area"}</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="any" placeholder="e.g. 1200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="areaUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sq-ft">Square feet (sq ft)</SelectItem>
                        <SelectItem value="sq-m">Square meters (sq m)</SelectItem>
                        <SelectItem value="aana">Aana</SelectItem>
                        <SelectItem value="dhur">Dhur</SelectItem>
                        <SelectItem value="kattha">Kattha</SelectItem>
                        <SelectItem value="bigha">Bigha</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  render={({ field }) => (
                    <FormItem>
                      <BuiltYearFilter
                        label="Built year"
                        placeholder="Select year"
                        value={field.value ? new Date(field.value).getFullYear().toString() : ""}
                        onChange={(year) => {
                          field.onChange(year ? new Date(Number(year), 0, 1) : undefined);
                        }}
                        disabled={form.formState.isSubmitting}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
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
                          <SelectItem value="North">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassNorthSouth
                                className="size-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span>North</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="East">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassEW className="size-4 shrink-0" aria-hidden="true" />
                              <span>East</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="West">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassEW className="size-4 shrink-0" aria-hidden="true" />
                              <span>West</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="South">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassNorthSouth
                                className="size-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span>South</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="North-East">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassNESW className="size-4 shrink-0" aria-hidden="true" />
                              <span>North-East</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="North-West">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassNWSE className="size-4 shrink-0" aria-hidden="true" />
                              <span>North-West</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="South-East">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassNWSE className="size-4 shrink-0" aria-hidden="true" />
                              <span>South-East</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="South-West">
                            <span className="inline-flex items-center gap-2">
                              <Icons.compassNESW className="size-4 shrink-0" aria-hidden="true" />
                              <span>South-West</span>
                            </span>
                          </SelectItem>
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
                <FormField
                  control={form.control}
                  name="evCharging"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm col-span-1">
                      <div className="space-y-0.5">
                        <FormLabel>EV Charging</FormLabel>
                        <FormDescription>Is EV charging available?</FormDescription>
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
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="agricultural">Agricultural</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
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

        <Card>
          <div className="h-1 w-full bg-primary/80 rounded-t-md" />
          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>
              {isHouse ? "Facilities & amenities" : "Utilities & site features"}
            </CardTitle>

            <CardDescription>
              {isHouse
                ? "Select facilities currently available at this property."
                : "Select connections and features already present on the plot."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="facilities"
              render={({ field }) => (
                <FormItem>
                  <FacilitiesPicker
                    propertyType={propertyType}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />

                  <FormDescription>
                    Leave unconfirmed facilities unselected. Explain shared access or additional
                    charges in the description.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 4: Images */}
        <Card>
          <div className="h-1 w-full bg-primary/80 rounded-t-md" />
          <CardHeader className="space-y-2 my-5 ml-6">
            <CardTitle>Property Images</CardTitle>
            <CardDescription>
              Upload images of your property (max 10 images, 10MB each).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 border-gray-300 dark:border-gray-600 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Icons.cloudUpload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP or GIF (MAX. 10MB)
                  </p>
                  {uploadedImages.length > 0 && (
                    <p className="mt-2 text-sm font-medium text-primary">
                      {uploadedImages.length} / 10 images uploaded
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="dropzone-file"
                  type="file"
                  accept="image/jpeg, image/png, image/jpg, image/webp, image/gif"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  disabled={isUploading || uploadedImages.length >= 10}
                />
              </label>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uploading images...</span>
                  <span className="font-medium">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Image Preview */}
            <ImagePreview images={uploadedImages} onRemove={handleRemoveImage} />
          </CardContent>
        </Card>

        {form.formState.isSubmitted && Object.keys(form.formState.errors).length > 0 && (
          <div role="alert" className="rounded-md border border-destructive p-4 text-destructive">
            <p className="font-medium">
              Please correct these details before creating your listing:
            </p>
            <ul className="mt-2 list-disc pl-5">
              {Object.entries(form.formState.errors).map(([name, error]) => (
                <li key={name}>
                  {fieldLabel(name)}: {error?.message ?? "Invalid value"}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col-reverse items-center gap-3 pt-6 sm:flex-row sm:justify-center">
          {editSlug && (
            <Button
              asChild
              variant="outline"
              className={cn(
                "w-full sm:w-auto",
                (isLoading || isUploading) && "pointer-events-none opacity-50"
              )}
            >
              <Link
                href={`/property/${editSlug}`}
                aria-disabled={isLoading || isUploading}
                tabIndex={isLoading || isUploading ? -1 : undefined}
              >
                Cancel
              </Link>
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || isUploading || isResolvingAddress}
            className="w-full sm:w-auto"
          >
            {isLoading
              ? isEditing
                ? "Saving!"
                : "Creating listing!"
              : isEditing
                ? "Save changes"
                : "Create New Property Listing"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
