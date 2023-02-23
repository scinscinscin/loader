import React, { useEffect, useState } from "react";

interface Common {
  ErrorFunction?: React.FC;
  LoadingFunction?: React.FC;
}

interface LoaderProps<Datatype> extends Common {
  fetchFn: () => Promise<Datatype>;
  SuccessFunction: React.FC<{ data: Datatype }>;
}

export function Loader<Data>({ fetchFn, LoadingFunction, ErrorFunction, SuccessFunction }: LoaderProps<Data>) {
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetchFn()
      .then((res) => setData(res))
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (data !== null) return <SuccessFunction data={data as Data} />;

  if (isError)
    return ErrorFunction ? (
      <ErrorFunction />
    ) : (
      <h1 style={{ backgroundColor: "#ff00ff", color: "#00ff00" }}>an error has occured...</h1>
    );
  return LoadingFunction ? <LoadingFunction /> : <h1>loading...</h1>;
}

interface UseLoaderOpts<Props, Datatype> extends Common {
  fetchFn: (props: Props) => Promise<Datatype>;
  SuccessFunction: React.FC<Props & { data: Datatype }>;
}

export function useLoader<Props, Data>(Opts: UseLoaderOpts<Props, Data>): React.FC<Props> {
  return (props) => (
    <Loader
      fetchFn={() => Opts.fetchFn(props)}
      SuccessFunction={({ data }) => <Opts.SuccessFunction {...props} data={data} />}
    />
  );
}
