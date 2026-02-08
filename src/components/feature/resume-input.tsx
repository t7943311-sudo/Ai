'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import { parseResumeDocument } from '@/ai/flows/parse-resume-document';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Loader2, FileText, Upload, X, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ResumeInputProps {
  value: string;
  onTextChange: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: string;
}

export function ResumeInput({
  value,
  onTextChange,
  placeholder,
  disabled,
  height = '400px',
}: ResumeInputProps) {
  const [isParsing, startParsing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = useCallback(async (file: File | null) => {
    if (!file) return;

    if (
      file.type !== 'application/pdf' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      setError('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }

    setError(null);
    setFileName(file.name);
    startParsing(async () => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUri = e.target?.result as string;
          try {
            const result = await parseResumeDocument({ fileDataUri: dataUri });
            onTextChange(result.text);
            toast({
              title: 'Upload Successful',
              description: `${file.name} has been parsed and loaded.`,
            });
          } catch (parseError: any) {
            console.error('Parsing failed:', parseError);
            setError(parseError.message || 'Failed to parse the document.');
            setFileName(null);
            onTextChange('');
          }
        };
        reader.readAsDataURL(file);
      } catch (readError: any) {
        console.error('File read failed:', readError);
        setError('Failed to read the file.');
        setFileName(null);
        onTextChange('');
      }
    });
  }, [onTextChange, toast]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] || null);
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFile(e.dataTransfer.files?.[0] || null);
  }

  const clearFile = () => {
    setFileName(null);
    onTextChange('');
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <Tabs defaultValue="paste" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="paste" disabled={disabled}>Paste Text</TabsTrigger>
        <TabsTrigger value="upload" disabled={disabled}>Upload File</TabsTrigger>
      </TabsList>
      <TabsContent value="paste">
        <Textarea
          value={value}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="font-mono text-sm"
          style={{ minHeight: height }}
        />
      </TabsContent>
      <TabsContent value="upload">
        <div className="space-y-2" style={{ minHeight: height }}>
          {isParsing ? (
             <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Parsing {fileName}...</p>
             </div>
          ) : fileName ? (
             <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed border-green-500 bg-green-500/10 text-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="mt-2 font-semibold">{fileName}</p>
                <p className="text-sm text-muted-foreground">Successfully parsed.</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={clearFile} disabled={disabled}>
                    <X className="mr-2 h-4 w-4" /> Clear and upload another
                </Button>
             </div>
          ) : (
            <div
                className={cn("flex h-full min-h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed text-center transition-colors",
                    isDragOver ? "border-primary bg-accent" : ""
                )}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true);}}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false);}}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation();}}
                onDrop={onDrop}
            >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                    <Button variant="link" size="sm" onClick={() => fileInputRef.current?.click()} disabled={disabled}>Click to upload</Button> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF or DOCX</p>
                <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={onFileChange} disabled={disabled} />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
