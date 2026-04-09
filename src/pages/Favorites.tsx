import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Heart, Music, Search, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type FavoritePlaylist = {
  id: string;
  created_at: string;
  title: string;
  mood: string;
  description: string | null;
  selected_filters: any;
};

export default function Favorites() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoritePlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const storageKey = `vibemix-favorite-playlists:${user.id}`;
      const stored = localStorage.getItem(storageKey);
      let ids: string[] = [];
      if (stored) {
        try {
          ids = JSON.parse(stored) as string[];
        } catch {
          ids = [];
        }
      }
      if (ids.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("generated_playlists")
        .select("id, created_at, title, mood, description, selected_filters")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load favorites",
          variant: "destructive",
        });
      } else {
        setFavorites((data as FavoritePlaylist[]) ?? []);
      }
      setLoading(false);
    };

    void loadFavorites();
  }, [user, toast]);

  const removeFromFavorites = (playlistId: string) => {
    if (!user) return;
    const storageKey = `vibemix-favorite-playlists:${user.id}`;
    const next = favorites.filter((favorite) => favorite.id !== playlistId);
    setFavorites(next);
    localStorage.setItem(storageKey, JSON.stringify(next.map((item) => item.id)));
    toast({
      title: t("favorites.removedTitle"),
      description: t("favorites.removedDesc"),
    });
  };

  const openPlaylistInPlatform = (playlistTitle: string, platform: "spotify" | "apple_music" | "youtube_music") => {
    const query = encodeURIComponent(playlistTitle);
    const urls: Record<"spotify" | "apple_music" | "youtube_music", string> = {
      spotify: `https://open.spotify.com/search/${query}`,
      apple_music: `https://music.apple.com/search?term=${query}`,
      youtube_music: `https://www.youtube.com/results?search_query=${query}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  const visibleFavorites = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filtered = favorites.filter((favorite) => {
      if (!normalizedQuery) return true;
      return (
        favorite.title.toLowerCase().includes(normalizedQuery) ||
        (favorite.description?.toLowerCase().includes(normalizedQuery) ?? false) ||
        favorite.mood.toLowerCase().includes(normalizedQuery)
      );
    });

    const sorted = [...filtered];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [favorites, searchQuery, sortBy]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <User className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">{t("profile.loginRequired")}</h2>
            <p className="text-muted-foreground mb-4">{t("profile.loginRequiredDesc")}</p>
            <Button onClick={() => navigate("/")}>{t("profile.goHome")}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3 mb-6">
          <Heart className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold gradient-text">{t("favorites.title")}</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t("favorites.loading")}
            </CardContent>
          </Card>
        ) : favorites.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <Heart className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-lg font-medium mb-1">{t("favorites.emptyTitle")}</p>
              <p className="text-muted-foreground mb-4">{t("favorites.emptyDesc")}</p>
              <Button onClick={() => navigate("/discover")}>{t("favorites.discover")}</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={t("favorites.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "title")}>
                <SelectTrigger className="sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("favorites.sortNewest")}</SelectItem>
                  <SelectItem value="oldest">{t("favorites.sortOldest")}</SelectItem>
                  <SelectItem value="title">{t("favorites.sortTitle")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {visibleFavorites.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  {t("favorites.noResults")}
                </CardContent>
              </Card>
            ) : null}

            <div className="grid gap-3">
            {visibleFavorites.map((favorite) => (
              <Card key={favorite.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    {favorite.title ?? t("favorites.unknownSong")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    {favorite.description || t("favorites.unknownArtist")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{favorite.mood}</Badge>
                    {favorite.selected_filters?.languages?.length ? (
                      <Badge variant="outline">{(favorite.selected_filters.languages as string[]).join(", ")}</Badge>
                    ) : null}
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPlaylistInPlatform(favorite.title, "spotify")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Spotify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPlaylistInPlatform(favorite.title, "apple_music")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> Apple Music
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openPlaylistInPlatform(favorite.title, "youtube_music")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" /> YouTube
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-500 hover:text-rose-600"
                      onClick={() => removeFromFavorites(favorite.id)}
                    >
                      <Heart className="h-3 w-3 mr-1 fill-current" /> {t("favorites.removeFromFavorites")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
