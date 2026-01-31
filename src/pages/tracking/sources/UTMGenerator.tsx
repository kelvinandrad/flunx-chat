import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Plus, Link2, ExternalLink, Check } from "lucide-react";
import { useState } from "react";

const recentUtms = [
  {
    id: 1,
    url: "https://exemplo.com/promo?utm_source=google&utm_medium=cpc&utm_campaign=black-friday-2024",
    source: "google",
    medium: "cpc",
    campaign: "black-friday-2024",
    uses: 1245,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    url: "https://exemplo.com/trial?utm_source=facebook&utm_medium=paid_social&utm_campaign=trial-jan",
    source: "facebook",
    medium: "paid_social",
    campaign: "trial-jan",
    uses: 890,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    url: "https://exemplo.com/webinar?utm_source=email&utm_medium=newsletter&utm_campaign=webinar-dez",
    source: "email",
    medium: "newsletter",
    campaign: "webinar-dez",
    uses: 456,
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    url: "https://exemplo.com/demo?utm_source=linkedin&utm_medium=paid_social&utm_campaign=b2b-demo",
    source: "linkedin",
    medium: "paid_social",
    campaign: "b2b-demo",
    uses: 234,
    createdAt: "2024-01-02",
  },
];

export default function UTMGenerator() {
  const [baseUrl, setBaseUrl] = useState("https://exemplo.com/");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const generateUrl = () => {
    const params = new URLSearchParams();
    if (source) params.append("utm_source", source);
    if (medium) params.append("utm_medium", medium);
    if (campaign) params.append("utm_campaign", campaign);
    if (content) params.append("utm_content", content);
    if (term) params.append("utm_term", term);

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Gerador de UTMs
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie URLs rastreáveis para suas campanhas
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Criar Nova UTM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>URL Base *</Label>
                <Input
                  placeholder="https://seusite.com/pagina"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Fonte (utm_source) *</Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">google</SelectItem>
                      <SelectItem value="facebook">facebook</SelectItem>
                      <SelectItem value="instagram">instagram</SelectItem>
                      <SelectItem value="linkedin">linkedin</SelectItem>
                      <SelectItem value="email">email</SelectItem>
                      <SelectItem value="tiktok">tiktok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Meio (utm_medium) *</Label>
                  <Select value={medium} onValueChange={setMedium}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpc">cpc</SelectItem>
                      <SelectItem value="paid_social">paid_social</SelectItem>
                      <SelectItem value="organic">organic</SelectItem>
                      <SelectItem value="email">email</SelectItem>
                      <SelectItem value="newsletter">newsletter</SelectItem>
                      <SelectItem value="referral">referral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Campanha (utm_campaign) *</Label>
                <Input
                  placeholder="nome-da-campanha"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Conteúdo (utm_content)</Label>
                  <Input
                    placeholder="variacao-a"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Termo (utm_term)</Label>
                  <Input
                    placeholder="palavra-chave"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Preview */}
              <div className="space-y-2">
                <Label>URL Gerada</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-foreground break-all font-mono">
                    {generateUrl()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 gap-2" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar URL
                    </>
                  )}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                UTMs Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUtms.map((utm) => (
                  <div
                    key={utm.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-foreground truncate">
                          {utm.url}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{utm.source}</Badge>
                      <Badge variant="outline">{utm.medium}</Badge>
                      <Badge variant="secondary">{utm.campaign}</Badge>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {utm.uses.toLocaleString()} usos
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
