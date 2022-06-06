import { Button, useToasts, Grid, Card, Table, Loading, Text, Input } from '@geist-ui/core';
import { User } from '@icon-park/react';
import { useStateIPC } from 'electron-state-ipc/react';

export default function MaintainerPanel() {
  const [text, setText] = useStateIPC('text', '');
  return (
    <div className="px-4 mx-auto max-w-172">
      <Text h2 className="text-center">
        Maintainer Panel
      </Text>
      <Card shadow width="100%">
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </Card>
    </div>
  );
}
