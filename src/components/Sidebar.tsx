import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CandlestickChart, Settings, FileText, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trades', icon: CandlestickChart, label: 'Trades' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/logs', icon: FileText, label: 'Logs' },
];
export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <motion.div
      animate={{ width: isExpanded ? 200 : 64 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      className="fixed left-0 top-0 h-full bg-card border-r z-50 flex flex-col"
    >
      <div className="flex items-center justify-center h-16 border-b">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center h-10 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                      isActive ? 'bg-primary/10 text-primary' : '',
                      isExpanded ? 'px-3' : 'justify-center'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="ml-4 text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </motion.div>
  );
}