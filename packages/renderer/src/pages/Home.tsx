import { Button, useToasts, Grid, Card, Table, Loading } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect } from 'react';

export default function Home() {
  const { data: itemsData, loading } = useRequest(() => axios.get('/items'), {});

  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={24}>
        <Card shadow width="100%">
          {loading ? (
            <Loading />
          ) : (
            <Table data={itemsData?.data.resultBody}>
              <Table.Column prop="id" label="id" />
              <Table.Column prop="name" label="name" />
            </Table>
          )}
        </Card>
      </Grid>
      <Grid xs={12}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={12}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={6}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={6}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={6}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={6}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={6}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={12}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={6}>
        <Card shadow width="100%" height="50px" />
      </Grid>
    </Grid.Container>
  );
}
