import * as React from 'react';
import { useState, useEffect, useRef } from 'react'


import Button from '@mui/material/Button';
import { Container, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import VoiceActorGrid from './VoiceActors';
import Pagination from '@mui/material/Pagination';

// TODO: refactor this into separate module to import elsewhere and unify.
const PAGE_SIZE_HEADER = 'x-list-page-size'
const CURRENT_PAGE_HEADER = 'x-list-current-page'
const TOTAL_PAGES_HEADER = 'x-list-total-pages'
const TOTAL_ROWS_HEADER = 'x-list-total-rows'

const allCustomHeaders = [PAGE_SIZE_HEADER, CURRENT_PAGE_HEADER, TOTAL_PAGES_HEADER, TOTAL_ROWS_HEADER]


export default function SearchBar() {
  const keywords = useRef('')
  const [data, setData] = useState([])
  const [searchState, setSearchState] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [err, setErr] = useState('')
  const userHasSearched = useRef(false);

  function handlePageChange(_, value) {
    setPage(value);
  };

  useEffect(() => {
    if (userHasSearched.current) {
      search();
    }
  }, [page]);


  const search = async () => {
    setSearchState('LOADING');
    // TODO implement dark mode.
    userHasSearched.current = true;
    try {
      // TODO: Add fetch options?
      const response = await fetch(`https://api.sandbox.voice123.com/providers/search/?service=voice_over&keywords=${encodeURIComponent(keywords.current)}&page=${page}`)


      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      const providers = result.providers;

      //const providerAsString = JSON.stringify(result.providers[0])
      //console.log('result is: ', JSON.stringify(result.providers[0], null, 4));

      setData(providers);
      setTotalPages(parseInt(response.headers.get('x-list-total-pages')));
    } catch (err) {
      setErr(err.message);
    } finally {
      setSearchState('DONE');
    }
  };
  // TODO: attempt changing event for event, value and just selecting value. 
  return (
    <Container>
      <Grid container spacing={4} alignItems='center'>
        <Grid item xs={10}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Keywords"
            variant="outlined"
            onChange={(event) => { keywords.current = event.target.value }}
            onKeyDown={(event) => {
              event.key === "Enter" ? search() : null
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" size="large" onClick={search}> Search </Button>
        </Grid>
        {
          data.length > 0 ?
            <>
              <Grid item xs={12}>
                <VoiceActorGrid actors={data} keywords={keywords.current} />
              </Grid>
              <Grid item xs={12}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
              </Grid>
            </>
            :
            <>
            </>
        }
      </Grid>
    </Container >
  );
}