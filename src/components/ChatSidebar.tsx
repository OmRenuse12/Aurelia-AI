import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageCircle, Trash2, PanelLeftClose, PanelLeft } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  messages: { role: string; content: string }[];
  createdAt: number;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ChatSidebar = ({ chats, activeChatId, onSelect, onNew, onDelete, isOpen, onToggle }: ChatSidebarProps) => {
  return (
    <>
      {/* Toggle button when closed */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onToggle}
          className="fixed top-3 left-3 z-20 w-9 h-9 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <PanelLeft size={18} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed left-0 top-0 bottom-0 w-64 z-20 glass-card border-r border-border flex flex-col"
          >
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-border">
              <span className="font-display text-sm font-semibold text-foreground">Chats</span>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNew}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onToggle}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PanelLeftClose size={16} />
                </motion.button>
              </div>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chats.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No chats yet</p>
              )}
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-sm ${
                    chat.id === activeChatId
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  onClick={() => onSelect(chat.id)}
                >
                  <MessageCircle size={14} className="flex-shrink-0" />
                  <span className="truncate flex-1">{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;
