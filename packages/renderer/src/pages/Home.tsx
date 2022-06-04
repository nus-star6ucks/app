import { Button, useToasts, Grid, Card } from '@geist-ui/core';

export default function Home() {
  const { setToast } = useToasts();
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={24}>
        <Card shadow width="100%" height="50px" />
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
