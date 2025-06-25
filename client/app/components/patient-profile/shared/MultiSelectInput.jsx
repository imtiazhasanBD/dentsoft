
'use client';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X as RemoveIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function MultiSelectInput({
  label,
  placeholder,
  selectedItems = [],
  onChange,
  suggestions = [], // These are the "important" suggestions for initial quick pick
  allAvailableSuggestions = [], // This should be the complete list for the dropdown
}) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!showDropdown) {
      setShowDropdown(true);
    }
  };

  const handleSelectItem = (itemToAdd) => {
    if (itemToAdd && !selectedItems.includes(itemToAdd)) {
      onChange([...selectedItems, itemToAdd]);
    }
    setInputValue('');
    setShowDropdown(false); 
  };

  const handleRemoveItem = (itemToRemove) => {
    onChange(selectedItems.filter((item) => item !== itemToRemove));
  };

  // Suggestions for the initial quick pick buttons (unselected important ones)
  const unselectedImportantSuggestions = suggestions.filter(s => !selectedItems.includes(s));

  // Suggestions for the dropdown (all available unselected items)
  // If allAvailableSuggestions is not provided, fall back to the 'suggestions' prop
  const comprehensiveSuggestionList = allAvailableSuggestions.length > 0 ? allAvailableSuggestions : suggestions;
  const dropdownSuggestions = comprehensiveSuggestionList.filter(s => !selectedItems.includes(s));
  
  const filteredDropdownSuggestions = inputValue
    ? dropdownSuggestions.filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
    : dropdownSuggestions;

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && <label className="text-sm font-medium block mb-1">{label}</label>}
      <div className="relative">
        <div
          className="flex flex-wrap gap-1 items-center p-2 border border-input rounded-md min-h-[40px] cursor-text bg-background"
          onClick={() => {
            setShowDropdown(true);
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          {selectedItems.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1 py-0.5 px-2 bg-lime-600 text-white">
              {item}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleRemoveItem(item);
                }}
                className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                aria-label={`Remove ${item}`}
              >
                <RemoveIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            ref={inputRef}
            type="text"
            placeholder={selectedItems.length === 0 ? placeholder : ''}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            className={cn(
              "flex-grow h-auto p-0 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm",
              selectedItems.length > 0 ? "min-w-[60px]" : "w-full"
            )}
            style={{ lineHeight: 'normal' }}
          />
        </div>

        {/* Dropdown List */}
        {showDropdown && filteredDropdownSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-popover shadow-lg p-2">
            {filteredDropdownSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSelectItem(suggestion)}
                className="w-full text-left p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md block"
              >
                {suggestion}
              </button>
            ))}
             {inputValue && !filteredDropdownSuggestions.some(s => s.toLowerCase() === inputValue.toLowerCase()) && !selectedItems.includes(inputValue) && (
                 <button
                    type="button"
                    onClick={() => handleSelectItem(inputValue)}
                    className="w-full text-left p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md block italic"
                  >
                    Add "{inputValue}"
                  </button>
             )}
          </div>
        )}
      </div>

      {/* Initial "Important" Suggestions (Quick Pick Buttons) */}
      {unselectedImportantSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center mr-1">Or select:</span>
          {unselectedImportantSuggestions.slice(0, 10).map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSelectItem(suggestion)}
              className="text-xs h-auto py-1 px-2 bg-blue-400 text-white hover:bg-blue-500 hover:text-white cursor-pointer"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
