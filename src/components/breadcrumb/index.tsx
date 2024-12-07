import { Breadcrumb } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

export const BreadcrumbCustom = ({ items }: { items: ItemType[] }) => {
  return <Breadcrumb items={items} />;
};
