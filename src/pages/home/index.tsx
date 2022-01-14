import { useCallback, useState } from "react";
import { List, ListItem } from "@chakra-ui/react";

import PatientAutosuggest from "../../components/PatientAutosuggest";

export default function HomePage() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSuggestionSelect = useCallback(
    (suggestion) => {
      async function fetchData() {
        let url = `https://6195803474c1bd00176c6d9a.mockapi.io/api/v1/patient`;

        if (typeof suggestion === "string") {
          url = `${url}?search=${suggestion}`;
        } else {
          const { firstName, lastName } = suggestion;
          url = `${url}?firstName=${firstName}&lastName=${lastName}`;
        }

        const response = await fetch(`${url}&page=1&limit=5`);
        const results = await response?.json();

        setSearchResults(results);
      }

      fetchData();
    },
    [setSearchResults]
  );

  return (
    <div>
      <PatientAutosuggest onSelect={handleSuggestionSelect} />
      <List>
        {searchResults.map((patient, i) => {
          const { firstName, lastName } = patient;
          return (
            <ListItem key={i}>
              {firstName} {lastName}
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
