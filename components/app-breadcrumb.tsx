import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb";

interface AppBreadcrumbProps {
  items: { label: string; href: string }[];
}

export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index !== items.length - 1 && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
            {index === items.length - 1 && (
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
