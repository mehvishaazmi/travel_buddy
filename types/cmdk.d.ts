declare module "cmdk" {
  import * as React from "react";

  export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const Command: React.FC<CommandProps>;

  export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export const CommandInput: React.FC<CommandInputProps>;

  export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const CommandList: React.FC<CommandListProps>;

  export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const CommandEmpty: React.FC<CommandEmptyProps>;

  export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const CommandGroup: React.FC<CommandGroupProps>;

  export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const CommandItem: React.FC<CommandItemProps>;

  export interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const CommandSeparator: React.FC<CommandSeparatorProps>;

  export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}
  export const CommandShortcut: React.FC<CommandShortcutProps>;
}