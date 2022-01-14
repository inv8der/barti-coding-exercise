import React, { useState, useCallback, useEffect, useRef } from "react";
import { Input, Menu, MenuList, MenuItem, MenuButton } from "@chakra-ui/react";
import Cookies from "js-cookie";

export type Props = {
  onSelect?: (suggestion: any) => void;
};

export default function PatientAutosuggest(props: Props) {
  const { onSelect } = props;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    []
  );

  const handleSuggestionClick = useCallback(
    (event: React.MouseEvent<any>) => {
      // @ts-ignore
      const index = parseInt(event.target.dataset.index);
      const suggestion = suggestions[index];

      if (onSelect) {
        const history = JSON.parse(Cookies.get("suggestionHistory") || "[]");

        // only add if not already in list
        history.push(suggestion);

        Cookies.set("suggestionHistory", JSON.stringify(history));

        onSelect(suggestion);
      }

      setOpen(false);
    },
    [onSelect, suggestions]
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query) {
      setOpen(false);
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const url = `https://6195803474c1bd00176c6d9a.mockapi.io/api/v1/patient?search=${query}`;
      const response = await fetch(url);
      const results = await response?.json();

      if (results.length > 0) {
        setSuggestions(results);
        setOpen(true);
      }
    }, 500);
  }, [query]);

  return (
    <div className="patient-autosuggest">
      <Menu isOpen={open}>
        <Input value={query} onChange={handleInputChange} />
        <MenuButton as="div" />
        <MenuList>
          {suggestions.map((suggestion, i) => {
            const { firstName, lastName } = suggestion;
            return (
              <MenuItem key={i} onClick={handleSuggestionClick}>
                {firstName} {lastName}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}
