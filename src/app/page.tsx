"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, PlusCircle } from "lucide-react";
import { createProduct, getProducts } from "./_data/products";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const createProductsSchema = z.object({
  name: z.string().nullable(),
  price: z.number().nullable(),
});

const productsFilterSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type CreateProductSchema = z.infer<typeof createProductsSchema>;
type ProductFilterSchema = z.infer<typeof productsFilterSchema>;

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const id = searchParams.get("id") ?? undefined;
  const name = searchParams.get("name") ?? undefined;

  console.log({ id, name });

  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      params.set(name, value);

      return params.toString();
    },
    [params]
  );

  const deleteParam = (name: string) => {
    params.delete(name);
  };

  const { data: products } = useQuery({
    queryKey: ["products", id, name],
    queryFn: () =>
      getProducts({
        id,
        name,
      }),
  });

  const { mutateAsync: createProductFn } = useMutation({
    mutationFn: createProduct,
    onSuccess: (_, variables) => {
      // const cached = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (data: any) => {
        return [
          ...data,
          {
            id: crypto.randomUUID(),
            name: variables.name,
            price: variables.price,
          },
        ];
      });
    },
  });

  const { register, handleSubmit } = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductsSchema),
  });

  const handleCreateProduct = async (data: CreateProductSchema) => {
    try {
      console.log(data);

      await createProductFn({
        name: data.name!,
        price: data.price!,
      });
    } catch (err) {
      alert("Erro Ao Cadastrar Um Novo Produto");
    }
  };

  const { register: registerFilters, handleSubmit: handleSubmitFilters } =
    useForm<ProductFilterSchema>({
      resolver: zodResolver(productsFilterSchema),
      defaultValues: {
        id,
        name,
      },
    });

  const productsFilterSubmit = async ({ id, name }: ProductFilterSchema) => {
    if (id) {
      router.push(pathname + "?" + createQueryString("id", id));
    } else {
      deleteParam("id");
    }

    if (name) {
      router.push(pathname + "?" + createQueryString("name", name));
    } else {
      deleteParam("name");
    }
  };

  return (
    <div className="p-6 max-w-4xl space-y-4 mx-auto">
      <h3 className="text-4xl font-bold">Produtos</h3>
      <div className="flex items-center justify-between">
        <form
          className="flex items-center gap-2"
          onSubmit={handleSubmitFilters(productsFilterSubmit)}
        >
          <Input
            id="id"
            placeholder="ID Do Produto"
            {...registerFilters("id")}
          />
          <Input
            id="name"
            placeholder="Nome Do Produto"
            {...registerFilters("name")}
          />
          <Button variant="secondary" type="submit">
            <Search className="mr-3 w-4 h-4" />
            Filtrar Resultados
          </Button>
        </form>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-3 w-4 h-4" />
              New Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Product</DialogTitle>
              <DialogDescription>
                Create new product in the system
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-6"
              onSubmit={handleSubmit(handleCreateProduct)}
            >
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label htmlFor="name">Produto</Label>
                <Input className="col-span-3" id="name" {...register("name")} />
              </div>

              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label htmlFor="price">Price</Label>
                <Input
                  className="col-span-3"
                  id="price"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
              return (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>R$ {product.price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
