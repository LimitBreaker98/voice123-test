import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import Button from '@mui/material/Button';
import { Container, Grid, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import VoiceActorGrid from './VoiceActors';
import Pagination from '@mui/material/Pagination';

export default function SearchComponent() {
  const keywords = useRef('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userHasSearched = useRef(false);

  function handlePageChange(_, value) {
    setPage(value);
  }

  useEffect(() => {
    if (userHasSearched.current) {
      search();
    }
  }, [page]);

  const search = async () => {
    userHasSearched.current = true;
    try {
      const response = await fetch(
        `https://api.sandbox.voice123.com/providers/search/?service=voice_over&keywords=${encodeURIComponent(
          keywords.current
        )}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      const providers = result.providers;

      setData(providers);
      setTotalPages(parseInt(response.headers.get('x-list-total-pages')));
    } catch (err) {
      console.log(err.message);
      // TODO: improve this by showing the user a text with a Try Again message.
    }
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems='flex'>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id='outlined-basic'
            label='Keywords'
            helperText='e.g: male sexy'
            variant='outlined'
            onChange={(event) => {
              keywords.current = event.target.value;
            }}
            onKeyDown={(event) => {
              event.key === 'Enter' ? search() : null;
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Button variant='contained' size='large' onClick={search}>
            Search
          </Button>
        </Grid>
        {data.length > 0 ? (
          <>
            <Grid item xs={12}>
              <VoiceActorGrid actors={data} keywords={keywords.current} />
            </Grid>
            <Grid item xs={12}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color='primary'
              />
            </Grid>
          </>
        ) : userHasSearched.current ? (
          <Grid item xs={12}>
            <Typography variant='h6'>
              No service providers found for your search. Try different keywords
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <Typography variant='h6'>
                Write the search criteria for your voice actor and we suggest
                some awesome people for your next project.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle'>
                Add keywords above separated by spaces and then click search or
                hit!
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
