import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data structure - replace with your actual data
const sampleImages = [
  {
    id: 1,
    name: "Mountain Landscape",
    category: "nature",
    tags: ["mountains", "landscape"],
    year: 2023,
  },
  {
    id: 2,
    name: "City Night",
    category: "urban",
    tags: ["city", "night"],
    year: 2024,
  },
  {
    id: 3,
    name: "Ocean Sunset",
    category: "nature",
    tags: ["ocean", "sunset"],
    year: 2023,
  },
  // Add more items as needed
];

const FilterableImageGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Get unique categories, tags, and years for filters
  const categories = [...new Set(sampleImages.map((img) => img.category))];
  const allTags = [...new Set(sampleImages.flatMap((img) => img.tags))];
  const years = [...new Set(sampleImages.map((img) => img.year))];

  // Filter and sort images
  const filteredImages = sampleImages
    .filter((image) => {
      const matchesSearch = image.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || image.category === selectedCategory;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => image.tags.includes(tag));
      const matchesYear =
        selectedYear === "all" || image.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesTags && matchesYear;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return b.year - a.year;
    });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search images..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              Tags ({selectedTags.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px]">
            <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTags([...selectedTags, tag]);
                  } else {
                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                  }
                }}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Year Filter */}
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Option */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <img
                src={`/api/placeholder/400/300`}
                alt={image.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <h3 className="font-medium">{image.name}</h3>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredImages.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No images found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterableImageGrid;
