export const DELIVERY_PAGE_SIZE = 5;

export const DELIVERY_SELECT_QUERY = `
  *,
  driver:user_table!delivery_table_driver_id_fkey(
    id,
    full_name,
    phone,
    detail:drivers!drivers_user_id_fkey(
      vehicle_type,
      driver_lat,
      driver_lng,
      last_location_update
    )
  )
`;