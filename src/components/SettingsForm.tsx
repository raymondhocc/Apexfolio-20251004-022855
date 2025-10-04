import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BotSettings, BotSettingsSchema } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/stores/app-store';
interface SettingsFormProps {
  defaultValues: BotSettings;
}
export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const updateSettings = useAppStore((state) => state.updateSettings);
  const form = useForm<BotSettings>({
    resolver: zodResolver(BotSettingsSchema),
    defaultValues: {
      ...defaultValues,
      targetAssets: defaultValues.targetAssets.join(', '),
    },
  });
  const onSubmit = (data: BotSettings) => {
    updateSettings(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Bot Configuration</CardTitle>
            <CardDescription>Adjust the parameters for the simulated trading bot.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                      <SelectItem value="arbitrage">Arbitrage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The algorithm the bot will use for trading decisions.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Percentage</FormLabel>
                  <FormControl>
                    <Slider
                      min={0.1}
                      max={10}
                      step={0.1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    The maximum percentage of the portfolio to risk on a single trade. Current: {field.value}%
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetAssets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Assets</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., AAPL, GOOGL, MSFT" {...field} />
                  </FormControl>
                  <FormDescription>
                    A comma-separated list of stock symbols for the bot to trade.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}