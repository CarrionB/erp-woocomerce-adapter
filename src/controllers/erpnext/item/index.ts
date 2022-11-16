import erpApi from "..";
import { Item } from "../../../types/item";
import logger from "../../../utilities/logger";

const ITEM_URL = `/api/resource/Item`;

export const erpSetWoocomerceId = async (
  item_code: string,
  id: string,
) => {
  const { data: resp } = await erpApi.put(`${ITEM_URL}/${item_code}`, {
    woocommerce_id: id,
  });

  const data = resp.data;
  logger.info(data);
  return data.name;
};

export const erpGetitemById = async (id: string) => {
  const { data: resp } = await erpApi.get(`${ITEM_URL}/${id}`);

  const data: Item = resp.data;
  const { woocommerce_id, item_code, standard_rate, item_name, item_group } =
    data;

  return { woocommerce_id, item_code, standard_rate, item_name, item_group };
};

export const erpGetitemByWId = async (wid: number) => {
  const { data: resp } = await erpApi.get(
    `${ITEM_URL}?filters=[["woocommerce_id", "=", "${wid}"]]`
  );
  const data: Partial<Item>[] = resp.data;
  if (data.length > 0) {
    return data[0].name;
  }
  return null;
};
