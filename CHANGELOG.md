# Changelog — Chat

**Data:** 2025-08-11

## Adicionado

* **Seleção de participantes na criação do chat**

  * Busca por nome e **adição manual** de usuários.
  * Checkboxes por usuário: **Participa** e **Adm**.
  * O criador entra **automaticamente** e fica **travado como administrador**.
* **Política de envio (“apenas leitura”)**

  * Opção **Apenas administradores podem enviar** (modo leitura) no modal de criação.
  * Envio é bloqueado para não-admins quando ativo.
* **Helpers**

  * `getAllKnownUsers()` — consolida nomes de `localStorage.users`, dos chats existentes e do usuário atual.
  * `canUserPost(chat, userName)` — checa permissão de envio conforme a política.
  * `showToast(msg)` — placeholder para feedback (substituível pelo seu sistema de toast).

## Alterado

* **UI do input de mensagens**

  * Desativa **input** e **botão Enviar** quando o chat está em modo somente admins, com placeholder explicativo.
* **Criação de chat**

  * Persistência dos novos campos no objeto do chat: `admins` e `policies.posting`.
  * Persistência de `chatGrupos` no `localStorage` após criar.
* **Indicador de tipo**

  * Badge do tipo do chat agora possui **tooltip** (“Público” / “Privado”).

## Corrigido / Robustez

* **Prevenção de nulidade no DOM**

  * Guards adicionados em elementos como `currentChatName`, `chatMessages`, `chatInput`, `leaveChatBtn`, evitando erros do tipo “Cannot set properties of null”.

## Modelo de Dados (compatível)

* Objeto `chat` agora inclui:

  * `admins: string[]`
  * `policies: { posting: "all" | "admins" }`
* Campos existentes (`id`, `name`, `type`, `members`, `messages`) **inalterados**.

## Notas de Implementação

* **Fonte de usuários**: `getAllKnownUsers()` usa `localStorage.users` (string\[] ou `{name:string}[]`) + membros/admins dos grupos existentes + usuário atual.
* **Bloqueio de envio**: aplicado em `setupMessageSending()` usando `canUserPost()`.
* **UX**: Em `chatSelecionado()`, input/Enviar são (des)ativados de acordo com a política do chat.

## Quebra de Compatibilidade

* **Nenhuma.** Funciona com dados antigos após a migração acima (ou com defaults implícitos).
