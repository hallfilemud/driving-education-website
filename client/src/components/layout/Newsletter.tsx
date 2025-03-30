import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  subscribed: z.boolean().default(true)
});

type SubscribeFormValues = z.infer<typeof subscribeSchema>;

export default function Newsletter() {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const form = useForm<SubscribeFormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      subscribed: true
    }
  });

  const { mutate: subscribe, isPending } = useMutation({
    mutationFn: async (values: SubscribeFormValues) => {
      const res = await apiRequest("POST", "/api/subscribe", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setIsSubscribed(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to subscribe: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (values: SubscribeFormValues) => {
    subscribe(values);
  };

  return (
    <section className="py-12 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-white text-opacity-90">
              Get the latest driving laws, test changes, and study tips delivered to your inbox.
            </p>
          </div>
          <div className="md:w-1/2">
            {isSubscribed ? (
              <div className="bg-white bg-opacity-10 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                <p>You've successfully subscribed to our newsletter.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input 
                            placeholder="Your email address" 
                            className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-neutral-800 w-full" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-white text-primary hover:bg-opacity-90 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {isPending ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </Form>
            )}
            <p className="mt-2 text-sm text-white text-opacity-80">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
