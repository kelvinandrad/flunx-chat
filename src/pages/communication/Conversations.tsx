import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  MessageCircle, 
  Bot,
  User,
  Clock,
  Filter,
  Wrench,
  ChevronRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const conversations = [
  {
    id: 1,
    person: { name: "Ana Costa", initials: "AC" },
    channel: "WhatsApp",
    agent: "Vendas AI",
    status: "resolved",
    lastMessage: "Perfeito, já agendei a demonstração para quinta-feira às 14h.",
    messageCount: 12,
    duration: "8 min",
    time: "10:45",
    date: "Hoje"
  },
  {
    id: 2,
    person: { name: "Carlos Silva", initials: "CS" },
    channel: "Email",
    agent: "Suporte AI",
    status: "active",
    lastMessage: "Entendi, vou verificar a situação do seu pedido.",
    messageCount: 5,
    duration: "3 min",
    time: "10:32",
    date: "Hoje"
  },
  {
    id: 3,
    person: { name: "Maria Santos", initials: "MS" },
    channel: "Webchat",
    agent: "Orquestrador",
    status: "escalated",
    lastMessage: "Vou transferir você para um de nossos especialistas.",
    messageCount: 8,
    duration: "5 min",
    time: "10:15",
    date: "Hoje"
  },
  {
    id: 4,
    person: { name: "João Oliveira", initials: "JO" },
    channel: "Instagram",
    agent: "Agendamento AI",
    status: "resolved",
    lastMessage: "Agendamento confirmado! Até breve.",
    messageCount: 6,
    duration: "4 min",
    time: "09:45",
    date: "Hoje"
  },
];

const conversationMessages = [
  { id: 1, type: 'user', content: 'Olá, gostaria de saber mais sobre o plano empresarial', time: '10:30', buffer: false },
  { id: 2, type: 'user', content: 'Vocês fazem integração com SAP?', time: '10:30', buffer: true },
  { id: 3, type: 'agent', content: 'Olá Ana! Fico feliz em ajudar. Sim, temos integração nativa com SAP. Nosso plano empresarial inclui:', time: '10:31', agent: 'Vendas AI', tool: null },
  { id: 4, type: 'agent', content: '• Integração SAP\n• Suporte prioritário 24/7\n• Até 50 usuários\n• API completa', time: '10:31', agent: 'Vendas AI', tool: 'knowledge_base' },
  { id: 5, type: 'user', content: 'Interessante! Qual o valor?', time: '10:33', buffer: false },
  { id: 6, type: 'agent', content: 'O plano empresarial custa R$ 2.990/mês. Gostaria de agendar uma demonstração para ver na prática?', time: '10:34', agent: 'Vendas AI', tool: 'pricing_lookup' },
  { id: 7, type: 'user', content: 'Sim, pode ser quinta às 14h?', time: '10:40', buffer: false },
  { id: 8, type: 'agent', content: 'Perfeito! Verifiquei a disponibilidade e quinta-feira às 14h está disponível. Vou confirmar o agendamento.', time: '10:42', agent: 'Vendas AI', tool: 'calendar_check' },
  { id: 9, type: 'agent', content: 'Pronto! Demonstração agendada para quinta-feira, dia 18, às 14h. Você receberá um email com o link da reunião. Até lá! 🎯', time: '10:45', agent: 'Vendas AI', tool: 'schedule_meeting' },
];

export default function Conversations() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/10 text-emerald-500">Ativo</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-500/10 text-blue-500">Resolvido</Badge>;
      case 'escalated':
        return <Badge className="bg-amber-500/10 text-amber-500">Escalado</Badge>;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversations List */}
        <div className="w-96 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border space-y-4">
            <h1 className="text-xl font-semibold text-foreground">Conversas</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversas..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Todos os canais</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="webchat">Webchat</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                  <SelectItem value="escalated">Escalados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-4 border-b border-border cursor-pointer transition-colors ${
                  selectedConversation === conv.id ? 'bg-muted/50' : 'hover:bg-muted/30'
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {conv.person.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{conv.person.name}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{conv.channel}</Badge>
                      {getStatusBadge(conv.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Detail */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">AC</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-foreground">Ana Costa</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    <span>WhatsApp</span>
                    <span>•</span>
                    <Bot className="h-3 w-3" />
                    <span>Vendas AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">12 mensagens</p>
                  <p className="text-xs text-muted-foreground">Duração: 8 min</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Pessoa
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Messages Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversationMessages.map((msg, index) => (
                <div key={msg.id}>
                  {/* Buffer indicator */}
                  {msg.buffer && (
                    <div className="flex items-center gap-2 mb-2 ml-12">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs text-muted-foreground bg-background px-2">
                        Agrupado pelo buffer (5s)
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  
                  <div className={`flex gap-3 ${msg.type === 'agent' ? 'justify-start' : 'justify-end'}`}>
                    {msg.type === 'agent' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${msg.type === 'agent' ? '' : 'order-first'}`}>
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        msg.type === 'agent' 
                          ? 'bg-muted/50 text-foreground rounded-tl-sm' 
                          : 'bg-primary text-primary-foreground rounded-tr-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                        msg.type === 'agent' ? '' : 'justify-end'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.type === 'agent' && msg.agent && (
                          <>
                            <span>•</span>
                            <span>{msg.agent}</span>
                          </>
                        )}
                        {msg.tool && (
                          <Badge variant="outline" className="text-xs gap-1 h-5">
                            <Wrench className="h-3 w-3" />
                            {msg.tool}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {msg.type === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Selecione uma conversa para visualizar</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
