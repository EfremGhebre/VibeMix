import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import PlaylistList from '@/components/playlist/PlaylistList';

export default function MyPlaylists() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Playlists</CardTitle>
              <CardDescription>
                Discover and manage your personalized music collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlaylistList limit={12} showCreateButton={true} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


